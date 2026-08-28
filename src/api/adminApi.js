import { fetchClient } from './fetchClient';

export const adminApi = {

  getCourses: async () => {
    return await fetchClient.get('/courses');
  },
  createCourse: async (courseData) => {
    return await fetchClient.post('/courses', courseData);
  },
  updateCourse: async (id, courseData) => {
    return await fetchClient.put(`/courses/${id}`, courseData);
  },
  deleteCourse: async (id) => {
    return await fetchClient.delete(`/courses/${id}`);
  },

 
  getExams: async () => {
    return await fetchClient.get('/exams');
  },
  getExamById: async (id) => {
    return await fetchClient.get(`/exams/${id}`);
  },
  createExam: async (examData) => {
    return await fetchClient.post('/exams', examData);
  },
  updateExam: async (id, examData) => {
    return await fetchClient.put(`/exams/${id}`, examData);
  },
  deleteExam: async (id) => {
    return await fetchClient.delete(`/exams/${id}`);
  },

 
  getStudents: async () => {
    return await fetchClient.get('/students');
  },
  createStudent: async (studentData) => {
    return await fetchClient.post('/students', studentData);
  },
  updateStudent: async (id, studentData) => {
    return await fetchClient.put(`/students/${id}`, studentData);
  },
  deleteStudent: async (id) => {
    return await fetchClient.delete(`/students/${id}`);
  },

  
  getExamQuestions: async (examId) => {
    return await fetchClient.get(`/exams/${examId}/questions`);
  },
  addExamQuestion: async (examId, questionData) => {
    return await fetchClient.post(`/exams/${examId}/questions`, questionData);
  },
  updateQuestion: async (id, questionData) => {
    return await fetchClient.put(`/questions/${id}`, questionData);
  },
  deleteQuestion: async (id) => {
    return await fetchClient.delete(`/questions/${id}`);
  },

  
  getExamResults: async (examId) => {
    return await fetchClient.get(`/exams/${examId}/results`);
  },
};