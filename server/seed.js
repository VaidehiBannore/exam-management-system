require('dotenv').config();
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');

  const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['admin', 'student'] },
    academicYear: String,
    section: String,
  }, { timestamps: true });

  const examSchema = new mongoose.Schema({
    subject: String,
    academicYear: String,
    section: String,
    examDate: Date,
    startTime: String,
    endTime: String,
  }, { timestamps: true });

  const User = mongoose.model('User', userSchema);
  const Exam = mongoose.model('Exam', examSchema);

  // Clear existing data
  await User.deleteMany({});
  await Exam.deleteMany({});

  // Create users
  const adminPassword = await bcryptjs.hash('Admin@123', 10);
  const studentPassword = await bcryptjs.hash('Student@123', 10);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin'
  });

  const studentA = await User.create({
    name: 'Student A',
    email: 'studentA@example.com',
    password: studentPassword,
    role: 'student',
    academicYear: '2nd Year',
    section: 'A'
  });

  const studentB = await User.create({
    name: 'Student B',
    email: 'studentB@example.com',
    password: studentPassword,
    role: 'student',
    academicYear: '2nd Year',
    section: 'B'
  });

  const studentC = await User.create({
    name: 'Student C',
    email: 'studentC@example.com',
    password: studentPassword,
    role: 'student',
    academicYear: '1st Year',
    section: 'A'
  });

  // Create exams
  const today = new Date();

  await Exam.create({
    subject: 'Mathematics',
    academicYear: '2nd Year',
    section: 'A',
    examDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '11:00'
  });

  await Exam.create({
    subject: 'Physics',
    academicYear: '2nd Year',
    section: 'A',
    examDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
    startTime: '14:00',
    endTime: '16:00'
  });

  await Exam.create({
    subject: 'Chemistry',
    academicYear: '2nd Year',
    section: 'B',
    examDate: new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000),
    startTime: '10:00',
    endTime: '12:00'
  });

  await Exam.create({
    subject: 'English',
    academicYear: '1st Year',
    section: 'A',
    examDate: new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000),
    startTime: '09:00',
    endTime: '11:00'
  });

  console.log('✓ Seed data created successfully');
  console.log('\nDemo Credentials:');
  console.log('Admin: admin@example.com / Admin@123');
  console.log('Student A (2nd Year, Section A): studentA@example.com / Student@123');
  console.log('Student B (2nd Year, Section B): studentB@example.com / Student@123');
  console.log('Student C (1st Year, Section A): studentC@example.com / Student@123');

  process.exit(0);
}).catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});