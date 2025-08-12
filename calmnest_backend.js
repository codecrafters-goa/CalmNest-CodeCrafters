const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Strict rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // limit each IP to 5 requests per windowMs
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/calmnest', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    min: 13,
    max: 120
  },
  preferences: {
    favoriteTherapies: [String],
    musicGenres: [String],
    bookCategories: [String]
  },
  progress: {
    sessionsCompleted: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, // in minutes
    lastActive: { type: Date, default: Date.now }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'therapist', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true
});

// Audio Content Schema
const audioContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['music', 'podcast', 'meditation', 'nature-sounds', 'affirmations']
  },
  audioUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  artist: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  playCount: {
    type: Number,
    default: 0
  },
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    }
  }]
}, {
  timestamps: true
});

// Reading Content Schema
const readingContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quotes', 'articles', 'stories', 'poems', 'affirmations']
  },
  author: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  readCount: {
    type: Number,
    default: 0
  },
  likes: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Yoga Content Schema
const yogaContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: String,
  imageUrl: String,
  instructions: [String],
  duration: Number, // in minutes
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  category: {
    type: String,
    enum: ['stretching', 'meditation', 'breathing', 'full-routine'],
    required: true
  },
  benefits: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// User Session Schema
const userSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  therapyType: {
    type: String,
    required: true,
    enum: ['audio', 'reading', 'yoga', 'laughing', 'talking', 'child', 'spiritual']
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  duration: Number, // in minutes
  completionStatus: {
    type: String,
    enum: ['started', 'completed', 'paused'],
    default: 'started'
  },
  notes: String,
  moodBefore: {
    type: Number,
    min: 1,
    max: 10
  },
  moodAfter: {
    type: Number,
    min: 1,
    max: 10
  }
}, {
  timestamps: true
});

// Models
const User = mongoose.model('User', userSchema);
const AudioContent = mongoose.model('AudioContent', audioContentSchema);
const ReadingContent = mongoose.model('ReadingContent', readingContentSchema);
const YogaContent = mongoose.model('YogaContent', yogaContentSchema);
const UserSession = mongoose.model('UserSession', userSessionSchema);

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = file.mimetype.startsWith('audio/') ? 'uploads/audio/' : 'uploads/images/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'image/jpeg', 'image/png', 'image/gif', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// JWT Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'calmnest-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Auth Routes
app.post('/api/auth/register', authLimiter, async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, age } = req.body;

    // Validation
    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(409).json({ error: 'User with this email or username already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      age
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'calmnest-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/login', authLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last active
    user.progress.lastActive = new Date();
    await user.save();

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'calmnest-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        preferences: user.preferences,
        progress: user.progress
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Profile Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, age, preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { firstName, lastName, age, preferences },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Audio Content Routes
app.get('/api/audio', async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } }
      ];
    }

    const audioContent = await AudioContent.find(query)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await AudioContent.countDocuments(query);

    res.json({
      content: audioContent,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/audio', authenticateToken, upload.single('audioFile'), async (req, res) => {
  try {
    const { title, description, category, artist, tags, duration } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ error: 'Audio file is required' });
    }

    const audioContent = new AudioContent({
      title,
      description,
      category,
      audioUrl: `/uploads/audio/${req.file.filename}`,
      duration: parseInt(duration),
      artist,
      tags: tags ? JSON.parse(tags) : [],
      uploadedBy: req.user.userId
    });

    await audioContent.save();
    res.status(201).json({ message: 'Audio content uploaded successfully', content: audioContent });
  } catch (error) {
    console.error('Audio upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reading Content Routes
app.get('/api/reading', async (req, res) => {
  try {
    const { category, page = 1, limit = 20, search } = req.query;
    
    let query = { isActive: true };
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }

    const readingContent = await ReadingContent.find(query)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ReadingContent.countDocuments(query);

    res.json({
      content: readingContent,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/reading', authenticateToken, async (req, res) => {
  try {
    const { title, content, category, author, tags } = req.body;

    const readingContent = new ReadingContent({
      title,
      content,
      category,
      author,
      tags: tags || [],
      uploadedBy: req.user.userId
    });

    await readingContent.save();
    res.status(201).json({ message: 'Reading content created successfully', content: readingContent });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Yoga Content Routes
app.get('/api/yoga', async (req, res) => {
  try {
    const { difficulty, category, page = 1, limit = 20 } = req.query;
    
    let query = { isActive: true };
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;

    const yogaContent = await YogaContent.find(query)
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await YogaContent.countDocuments(query);

    res.json({
      content: yogaContent,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/yoga', authenticateToken, upload.fields([
  { name: 'videoFile', maxCount: 1 },
  { name: 'imageFile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, instructions, duration, difficulty, category, benefits } = req.body;

    const yogaContent = new YogaContent({
      title,
      description,
      instructions: JSON.parse(instructions || '[]'),
      duration: parseInt(duration),
      difficulty,
      category,
      benefits: JSON.parse(benefits || '[]'),
      videoUrl: req.files.videoFile ? `/uploads/videos/${req.files.videoFile[0].filename}` : null,
      imageUrl: req.files.imageFile ? `/uploads/images/${req.files.imageFile[0].filename}` : null,
      uploadedBy: req.user.userId
    });

    await yogaContent.save();
    res.status(201).json({ message: 'Yoga content created successfully', content: yogaContent });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Session Tracking
app.post('/api/sessions', authenticateToken, async (req, res) => {
  try {
    const { therapyType, contentId, duration, moodBefore, moodAfter, notes } = req.body;

    const session = new UserSession({
      userId: req.user.userId,
      therapyType,
      contentId,
      duration,
      moodBefore,
      moodAfter,
      notes,
      completionStatus: 'completed'
    });

    await session.save();

    // Update user progress
    await User.findByIdAndUpdate(req.user.userId, {
      $inc: {
        'progress.sessionsCompleted': 1,
        'progress.totalTimeSpent': duration
      },
      'progress.lastActive': new Date()
    });

    res.status(201).json({ message: 'Session recorded successfully', session });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/sessions/history', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const sessions = await UserSession.find({ userId: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await UserSession.countDocuments({ userId: req.user.userId });

    res.json({
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics Routes (Admin only)
app.get('/api/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSessions = await UserSession.countDocuments();
    const totalAudioContent = await AudioContent.countDocuments();
    const totalReadingContent = await ReadingContent.countDocuments();
    
    // Most popular therapy types
    const popularTherapies = await UserSession.aggregate([
      { $group: { _id: '$therapyType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // User engagement metrics
    const activeUsers = await User.countDocuments({
      'progress.lastActive': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      totalUsers,
      totalSessions,
      totalAudioContent,
      totalReadingContent,
      activeUsers,
      popularTherapies
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Static file serving
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`CalmNest backend server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;