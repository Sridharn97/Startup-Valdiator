import Idea from '../models/Idea.js';

// @desc    Get all ideas
// @route   GET /api/ideas
// @access  Public
export const getIdeas = async (req, res) => {
  try {
    const { category, status } = req.query;
    let query = {};

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    // Filter by status if provided (default to Approved for public view)
    if (status) {
      query.status = status;
    } else {
      query.status = 'Approved';
    }

    const ideas = await Idea.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single idea by ID
// @route   GET /api/ideas/:id
// @access  Public
export const getIdeaById = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id)
      .populate('user', 'username');

    if (idea) {
      res.json(idea);
    } else {
      res.status(404).json({ message: 'Idea not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create a new idea
// @route   POST /api/ideas
// @access  Private
export const createIdea = async (req, res) => {
  try {
    const { title, description, category, techStack } = req.body;

    const idea = await Idea.create({
      title,
      description,
      category,
      techStack,
      user: req.user._id,
      status: 'Pending'
    });

    res.status(201).json(idea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update an idea
// @route   PUT /api/ideas/:id
// @access  Private
export const updateIdea = async (req, res) => {
  try {
    const { title, description, category, techStack } = req.body;
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Make sure user owns the idea
    if (idea.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    const updatedIdea = await Idea.findByIdAndUpdate(
      req.params.id,
      {
        title: title || idea.title,
        description: description || idea.description,
        category: category || idea.category,
        techStack: techStack || idea.techStack,
        status: 'Pending' // Reset to pending after edit
      },
      { new: true }
    );

    res.json(updatedIdea);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an idea
// @route   DELETE /api/ideas/:id
// @access  Private
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Make sure user owns the idea
    if (idea.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await idea.deleteOne();

    res.json({ message: 'Idea removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Vote on an idea
// @route   POST /api/ideas/:id/vote
// @access  Private
export const voteIdea = async (req, res) => {
  try {
    const { voteType } = req.body;
    
    if (!['up', 'down'].includes(voteType)) {
      return res.status(400).json({ message: 'Invalid vote type' });
    }

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Check if user has already voted
    const existingVote = idea.votes.voters.find(
      voter => voter.userId.toString() === req.user._id.toString()
    );

    if (existingVote) {
      // If vote type is the same, remove the vote
      if (existingVote.voteType === voteType) {
        // Decrease the vote count
        idea.votes[voteType] -= 1;
        
        // Remove voter from voters array
        idea.votes.voters = idea.votes.voters.filter(
          voter => voter.userId.toString() !== req.user._id.toString()
        );
      } else {
        // If vote type is different, change the vote
        // Decrease the old vote count
        idea.votes[existingVote.voteType] -= 1;
        
        // Increase the new vote count
        idea.votes[voteType] += 1;
        
        // Update voter's vote type
        existingVote.voteType = voteType;
      }
    } else {
      // If user hasn't voted, add a new vote
      idea.votes[voteType] += 1;
      idea.votes.voters.push({
        userId: req.user._id,
        voteType
      });
    }

    await idea.save();

    res.json({
      message: 'Vote recorded',
      votes: {
        up: idea.votes.up,
        down: idea.votes.down
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user's ideas
// @route   GET /api/ideas/user
// @access  Private
export const getUserIdeas = async (req, res) => {
  try {
    const ideas = await Idea.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};