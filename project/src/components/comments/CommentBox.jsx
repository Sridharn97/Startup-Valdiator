import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Send, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthContext from '../../context/AuthContext';

const CommentBox = ({ ideaId }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated, isAdmin } = useContext(AuthContext);

  useEffect(() => {
    fetchComments();
  }, [ideaId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments/${ideaId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const response = await axios.post(`/api/comments/${ideaId}`, {
        content: commentText
      });
      setComments(prevComments => [response.data, ...prevComments]);
      setCommentText('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      setLoading(true);
      const url = isAdmin 
        ? `/api/admin/comments/${commentId}`
        : `/api/comments/${commentId}`;
      
      await axios.delete(url);
      setComments(prevComments => prevComments.filter(c => c._id !== commentId));
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>
      
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="flex items-start space-x-2">
            <div className="flex-grow">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="2"
                disabled={loading}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading || !commentText.trim()}
              className={`mt-1 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                (loading || !commentText.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <p className="text-blue-700">
            <a href="/login" className="font-semibold underline">Login</a> to add your comment.
          </p>
        </div>
      )}

      {loading && comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No comments yet. Be the first to comment!</div>
      ) : (
        <div className="space-y-4">
          {comments.map(comment => (
            <div key={comment._id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900">{comment.user?.username || 'Anonymous'}</span>
                    <span className="mx-2 text-gray-300">•</span>
                    <span className="text-sm text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="mt-1 text-gray-700">{comment.content}</p>
                </div>
                
                {(isAuthenticated && (user?._id === comment.user?._id || isAdmin)) && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentBox;