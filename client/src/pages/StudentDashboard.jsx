import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getStudentTimetable, getStudentProfile } from '../services/api';

export const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [student, setStudent] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const data = await getStudentTimetable();
      setStudent(data.student);
      setExams(data.exams);
    } catch (err) {
      setError('Failed to load timetable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-dashboard">
      <h1>Student Dashboard</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="student-info">
            <h2>{student?.name}</h2>
            <p><strong>Academic Year:</strong> {student?.academicYear}</p>
            <p><strong>Section:</strong> {student?.section}</p>
          </div>

          <h2>Your Timetable</h2>

          {error && <div className="error">{error}</div>}

          {exams.length === 0 ? (
            <p className="empty-state">No exams scheduled for your section</p>
          ) : (
            <table className="exams-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Date</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                </tr>
              </thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam._id}>
                    <td>{exam.subject}</td>
                    <td>{new Date(exam.examDate).toLocaleDateString()}</td>
                    <td>{exam.startTime}</td>
                    <td>{exam.endTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};