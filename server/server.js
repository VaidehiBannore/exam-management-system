const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    status: err.status || 500
  });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], required: true },
  academicYear: String,
  section: String,
}, { timestamps: true });

const examSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  academicYear: { type: String, required: true },
  section: { type: String, required: true },
  examDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Exam = mongoose.model('Exam', examSchema);

// Middleware: Authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = require('jsonwebtoken').verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Middleware: Authorize role
const authorize = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ message: 'Access denied' });
  }
  next();
};

// ============ AUTH ROUTES ============

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        academicYear: user.academicYear,
        section: user.section
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ ADMIN ROUTES ============

// POST /api/exams (Create)
app.post('/api/exams', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { subject, academicYear, section, examDate, startTime, endTime } = req.body;

    // Validation
    if (!subject || !academicYear || !section || !examDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate times
    if (endTime <= startTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const exam = new Exam({
      subject,
      academicYear,
      section,
      examDate,
      startTime,
      endTime
    });

    await exam.save();
    res.status(201).json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exams (All exams - admin only)
app.get('/api/exams', authenticate, authorize('admin'), async (req, res) => {
  try {
    const exams = await Exam.find().sort({ examDate: 1 });
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/exams/:id
app.get('/api/exams/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/exams/:id (Edit)
app.put('/api/exams/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { subject, academicYear, section, examDate, startTime, endTime } = req.body;

    // Validation
    if (!subject || !academicYear || !section || !examDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (endTime <= startTime) {
      return res.status(400).json({ message: 'End time must be after start time' });
    }

    const exam = await Exam.findByIdAndUpdate(
      req.params.id,
      { subject, academicYear, section, examDate, startTime, endTime },
      { new: true }
    );

    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/exams/:id
app.delete('/api/exams/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ STUDENT ROUTES ============

// GET /api/student/profile
app.get('/api/student/profile', authenticate, authorize('student'), async (req, res) => {
  try {
    const student = await User.findById(req.user.userId).select('-password');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (!student.academicYear || !student.section) {
      return res.status(400).json({ message: 'Student profile incomplete' });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/student/timetable - SECURE FILTERING
app.get('/api/student/timetable', authenticate, authorize('student'), async (req, res) => {
  try {
    // CRITICAL: Fetch student from database using authenticated user ID
    const student = await User.findById(req.user.userId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Validate student profile has year and section
    if (!student.academicYear || !student.section) {
      return res.status(400).json({ message: 'Student profile missing academic year or section' });
    }

    // CRITICAL: Use ACTUAL student data from database, NOT frontend parameters
    // Frontend cannot manipulate this - year/section come from authenticated student record
    const exams = await Exam.find({
      academicYear: student.academicYear,
      section: student.section
    }).sort({ examDate: 1 });

    res.json({
      student: {
        name: student.name,
        academicYear: student.academicYear,
        section: student.section
      },
      exams: exams
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ============ START SERVER ============

