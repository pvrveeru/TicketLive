import axios from 'axios';
import apiconfig from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const avdurl1 = apiconfig.develpoment.apibaseUrl;

const api = axios.create({
  baseURL: avdurl1,
  headers: {
    'Content-Type': 'application/json',
  },
});

async function getBearerToken() {
  try {
    const token = await AsyncStorage.getItem('acessToken');
    return token;
  } catch (err) {
    console.log('Async storage function error', err);
  }
}

api.interceptors.request.use(
  async config => {
    try {
      const token = await getBearerToken();
      // console.log('token', token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (err) {
      console.log('Request interceptor error', err);
      return config;
    }
  },
  error => {
    console.log('Request interceptor error', error);
    return Promise.reject(error);
  },
);

// Example API methods

export const createUser = async (phoneNumber: string) => {
  console.log(phoneNumber);
  try {
    const response = await axios.post(avdurl1 + 'users', { phoneNumber });
    return response.data.data;
  } catch (error: any) {
    console.log('Error creating user:', error.response?.data.message);
    throw error.message;
  }
};

export const createUserEvent = async (userPayload: any) => {
  try {
    const response = await axios.post(avdurl1 + 'users', userPayload);
    return response.data.data;
  } catch (error: any) {
    console.log('Error creating user:', error.message);
    throw error.message;
  }
};

export const validateOtp = async (phoneNumber: string, otpCode: string) => {
  try {
    const response = await axios.post(avdurl1 + '/otp/validate', { phoneNumber, otpCode });
    return response.data.data;
  } catch (error: any) {
    throw error.response?.data || 'An error occurred';
  }
};

export const createBooking = async (bookingData: any) => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  } catch (error: any) {
    console.log('error create bookings', error);
    throw error;
  }
};


export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error: any) {
    console.log('Error fetching events:', error.message);
    throw error.message;
  }
};

export const getAllEventCategories = async () => {
  try {
    const response = await api.get('/event-category');
    return response.data.data.categories;
  } catch (error: any) {
    console.log('Error fetching catageories:', error.message);
    throw error.message;
  }
};

// Function to fetch all events
export const fetchEvents = async (params = {}) => {
  try {
    const response = await api.get('/events', { params });

    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching events:', error.message);
    throw error.message;
  }
};

export const fetchFeaturedEvents = async (userId: number, limit: number = 10, offset: number = 0) => {
  try {
    const response = await api.get('/events', {
      params: {
        userId,
        isFeatured: true,
        status: 'Published',
        limit,
        offset,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching featured events:', error.message);
    throw error.message;
  }
};

export const fetchPopularEvents = async (userId: number, limit: number = 10, offset: number = 0) => {
  try {
    const response = await api.get('/events', {
      params: {
        userId,
        isPopular: true,
        status: 'Published',
        limit,
        offset,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching popular events:', error.message);
    throw error.message;
  }
};

export const fetchManualEvents = async (userId: number, limit: number = 10, offset: number = 0) => {
  try {
    const response = await api.get('events', {
      params: {
        userId,
        isManual: true,
        limit,
        offset,
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching manual events:', error.message);
    throw error.message;
  }
};


export const getEventById = async (eventId: number) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error:any) {
    console.log('Error fetching event details:', error.message);
    throw error.message;
  }
};

export const getSeatingOptionsByEventId = async (eventId: number) => {
  try {
    const response = await api.get(avdurl1 + `seating-options/event/${eventId}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Failed to fetch seating options', error.message);
    throw error.message;
  }
};

export const getAllFavouriteEvents = async (userId: number) => {
  try {
    const response = await api.get(`/favorites/user/${userId}`);
    return response.data.data;
  } catch (error:any) {
    console.log('Error fetching favorites:', error.message);
    throw error.message;
  }
};

export const getBookingsByUserId = async (userId: string) => {
  try {
    const response = await api.get('/bookings', {
      params: {
        userId,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      },
    });
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching bookings:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
  }
};

// Function to fetch tickets by bookingId
export const getTicketsByBookingId = async (bookingId: number) => {
  try {
    const response = await api.get(avdurl1 + `tickets/booking/${bookingId}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching tickets:', error.message);
    throw error.message;
  }
};

// Get notifications by user ID
export const getNotificationsByUserId = async (userId: string) => {
  try {
    const response = await api.get(avdurl1 + `/notifications/user/${userId}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching notifications:', error.message);
    throw new Error(error?.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const fetchBannerImages = async () => {
  try {
    const response = await api.get(avdurl1 + 'uploads/bannerImages');
    return response.data.images;
  } catch (error: any) {
    console.log('Error fetching banner images:', error.message);
    return null;
  }
};

export const fetchUserById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching user by ID:', error.message);
    throw error.message;
  }
};

export const getChargesByEventId = async (
  eventId: number
) => {
  try {
    const response = await api.get(`/charges/event/${eventId}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching user by ID:', error.message);
    throw error.message;
  }
};

export const markEventAsFavorite = async (body: any) => {
  try {
    const response = await api.post('/favorites', body);
    return response.data;
  } catch (error: any) {
    console.log('Error marking event as favorite:', error.message);
    throw error.message;
  }
};

export const markEventAsDeleteFavorite = async (userId: number, eventId: number) => {
  try {
    const response = await api.delete(`/favorites/user/${userId}/event/${eventId}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Error marking event as favorite delete:', error.message);
    throw error.message;
  }
};

export const updateUserNotifications = async (userId: number, notificationsEnabled: boolean) => {
  try {
    const response = await api.put(avdurl1 + `users/${userId}`, { notificationsEnabled });
    return response.data.data;
  } catch (error: any) {
    console.log('Error updating notifications:', error.message);
    throw error.message;
  }
};

export const updateUserProfile = async (userId: any, userDetails: any) => {
  try {
    const response = await api.put(`/users/${userId}`, userDetails);
    return response.data.data;
  } catch (error: any) {
    console.log('Error updating userdetails:', error.message);
    throw error;
  }
};
export const uploadUserProfile = async (userId: number, body: FormData) => {
  const url = avdurl1 + `uploads/user/${userId}`;
  try {
    const response = await api.post(url, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.urls;
  } catch (error:any) {
    console.log('Error uploading user profile:', error);
    throw error.message;
  }
};

