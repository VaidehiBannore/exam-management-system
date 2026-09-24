import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllExams, deleteExam } from '../services/api';
import { AuthContext } from '../context/AuthContext';

export const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getAllExams();
      setExams(data);
    } catch (err) {
      setError('Failed to load exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteExam(id);
        setExams(exams.filter(e => e._id !== id));
      } catch (err) {
        setError('Failed to delete exam');
      }
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.name}</p>

      <Link to="/admin/create-exam" className="btn-primary">+ Create Exam</Link>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : exams.length === 0 ? (
        <p className="empty-state">No exams created yet</p>
      ) : (
        <table className="exams-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Year</th>
              <th>Section</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map(exam => (
              <tr key={exam._id}>
                <td>{exam.subject}</td>
                <td>{exam.academicYear}</td>
                <td>{exam.section}</td>
                <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                <td>{exam.startTime}</td>
                <td>{exam.endTime}</td>
                <td>
                  <Link to={`/admin/edit-exam/${exam._id}`} className="btn-small">Edit</Link>
                  <button onClick={() => handleDelete(exam._id)} className="btn-small btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};