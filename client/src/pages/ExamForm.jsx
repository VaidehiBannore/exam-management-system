import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createExam, getExam, updateExam } from '../services/api';

export const ExamForm = ({ isEdit = false }) => {
  const [form, setForm] = useState({
    subject: '',
    academicYear: '',
    section: '',
    examDate: '',
    startTime: '',
    endTime: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (isEdit && id) {
      fetchExam();
    }
  }, [isEdit, id]);

  const fetchExam = async () => {
    try {
      const exam = await getExam(id);
      setForm(exam);
    } catch (err) {
      setError('Failed to load exam');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.subject || !form.academicYear || !form.section || !form.examDate || !form.startTime || !form.endTime) {
      setError('All fields are required');
      return;
    }

    if (form.endTime <= form.startTime) {
      setError('End time must be after start time');
      return;
    }

    try {
      setLoading(true);
      if (isEdit) {
        await updateExam(id, form);
      } else {
        await createExam(form);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exam-form-container">
      <h1>{isEdit ? 'Edit Exam' : 'Create Exam'}</h1>
      <form onSubmit={handleSubmit} className="exam-form">
        <div className="form-group">
          <label>Subject *</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Academic Year *</label>
          <select name="academicYear" value={form.academicYear} onChange={handleChange} required>
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
          </select>
        </div>

        <div className="form-group">
          <label>Section *</label>
          <select name="section" value={form.section} onChange={handleChange} required>
            <option value="">Select Section</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>
        </div>

        <div className="form-group">
          <label>Exam Date *</label>
          <input
            type="date"
            name="examDate"
            value={form.examDate ? form.examDate.split('T')[0] : ''}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Time *</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Time *</label>
          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Saving...' : isEdit ? 'Update Exam' : 'Create Exam'}
        </button>
      </form>
    </div>
  );
};