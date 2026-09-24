const API_URL = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

// Auth
export const login = async (email, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Admin - Exams
export const createExam = async (exam) => {
  const res = await fetch(`${API_URL}/exams`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(exam)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getAllExams = async () => {
  const res = await fetch(`${API_URL}/exams`, {
    method: 'GET',
    headers: headers()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getExam = async (id) => {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    method: 'GET',
    headers: headers()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const updateExam = async (id, exam) => {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(exam)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const deleteExam = async (id) => {
  const res = await fetch(`${API_URL}/exams/${id}`, {
    method: 'DELETE',
    headers: headers()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

// Student
export const getStudentProfile = async () => {
  const res = await fetch(`${API_URL}/student/profile`, {
    method: 'GET',
    headers: headers()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};

export const getStudentTimetable = async () => {
  const res = await fetch(`${API_URL}/student/timetable`, {
    method: 'GET',
    headers: headers()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
};