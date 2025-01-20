import axios from 'axios';
import apiconfig from '../config/config';
// import AsyncStorage from '@react-native-async-storage/async-storage';

const avdurl1 = apiconfig.develpoment.apibaseUrl;

const api = axios.create({
  baseURL: avdurl1,
  headers: {
    'Content-Type': 'application/json',
  },
});

// async function getBearerToken() {
//     try {
//       const token = await AsyncStorage.getItem('acessToken');
//       return token;
//     } catch (err) {
//       console.log('Async storage function error', err);
//     }
//   }

// api.interceptors.request.use(
//   async config => {
//     try {
//       const token = await getBearerToken();
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (err) {
//       console.error('Request interceptor error', err);
//       return config;
//     }
//   },
//   error => {
//     console.error('Request interceptor error', error);
//     return Promise.reject(error);
//   },
// );
// Example API methods


export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getEventById = async (eventId: number) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error);
    throw error;
  }
};

export const markEventAsFavorite = async (body: any) => {
  try {
    const response = await api.post('/favorites', body);
    return response.data;
  } catch (error) {
    console.error('Error marking event as favorite:', error);
    throw error;
  }
};


