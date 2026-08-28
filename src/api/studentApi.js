import { fetchClient } from './fetchClient';

export const studentApi = {
  getAvailableExams: async () => {
    return await fetchClient.get('/my/exams');
  },

  getExamById: async (examId) => {
    return await fetchClient.get(`/my/exams/${examId}`);
  },

  
  submitExam: async (examId, answers) => {
    return await fetchClient.post(`/my/exams/${examId}/submit`, { answers });
  },

  getMyResults: async () => {
    return await fetchClient.get('/my/results');
  },
};