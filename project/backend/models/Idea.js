import mongoose from 'mongoose';

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required']
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  votes: {
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    },
    voters: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        voteType: {
          type: String,
          enum: ['up', 'down']
        }
      }
    ]
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Set the updatedAt date before update
IdeaSchema.pre('findOneAndUpdate', function() {
  this.set({ updatedAt: Date.now() });
});

const Idea = mongoose.model('Idea', IdeaSchema);

export default Idea;