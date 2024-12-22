import axios from 'axios';
import { BASE_API_URL } from '../../config';

const fetchWithAuth = async (endpoint: string) => {
  const token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');

  if (!token) {
    throw new Error('Authorization token is missing');
  }

  const response = await axios.get(`${BASE_API_URL}${endpoint}`, {
    headers: { Authorization: token },
  });

  return response.data;
};

export const getStudentRegistrations = async () => {
  return fetchWithAuth('/student-registrations');
};

export const getMostPopularSubjects = async () => {
  return fetchWithAuth('/most-popular-subjects');
};

export const getUserCounts = async () => {
  return fetchWithAuth('/user-counts');
};
