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
    console.log('token in api service file', token);
    return token;
  } catch (err) {
    console.log('Async storage function error', err);
  }
}

api.interceptors.request.use(
  async config => {
    try {
      const token = await getBearerToken();
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


export interface ValidationError {
  msg: string;
  param: string;
}

export interface ErrorResponse {
  status: "error";
  message: string;
  errors?: ValidationError[]; // Only present for validation errors (400)
}

// Example API methods

export const createUser = async (phoneNumber: string) => {
  console.log(phoneNumber);
  try {
    const response = await axios.post(avdurl1 + 'users', { phoneNumber });
    console.log('response', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('Error creating user:', error);
    throw error;
  }
};

export const createUserEvent = async (userPayload: any) => {
  console.log('userPayload', userPayload);
  try {
    const response = await axios.post(avdurl1 + 'users', userPayload);
    console.log('response', response.data.data);
    return response.data.data;
  } catch (error) {
    console.log('Error creating user:', error);
    throw error;
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
    const response = await api.post('bookings', bookingData);
    console.log('Booking created:', response.data);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 400) {
        console.log("Validation failed:", data);
        throw {
          status: "error",
          message: "Validation failed",
          errors: data.errors || [],
        } as ErrorResponse;
      }

      if (status === 500) {
        console.log("Error creating booking:", data.message);
        throw {
          status: "error",
          message: `Error creating booking: ${data.message}`,
        } as ErrorResponse;
      }
    }
    throw error;
  }
};


export const getAllEvents = async () => {
  try {
    const response = await api.get('/events');
    return response.data;
  } catch (error) {
    console.log('Error fetching events:', error);
    throw error;
  }
};

// Function to fetch all events
export const fetchEvents = async (params = {}) => {
  console.log('params', params)
  try {
    const response = await api.get('events', { params });

    return response.data.data;
  } catch (error) {
    console.log("Error fetching events:", error);
    throw error;
  }
};

export const fetchFeaturedEvents = async (userId: number, limit: number = 10, offset: number = 0) => {
  try {
    const response = await api.get('/events', {
      params: {
        userId,
        isFeatured: true,
        limit,
        offset
      }
    });
    return response.data.data;
  } catch (error) {
    console.log('Error fetching featured events:', error);
    throw error;
  }
};

export const fetchPopularEvents = async (userId: number, limit: number = 10, offset: number = 0) => {
  try {
    const response = await api.get('/events', {
      params: {
        userId,
        isPopular: true,
        limit,
        offset
      }
    });
    return response.data.data;
  } catch (error) {
    console.log('Error fetching popular events:', error);
    throw error;
  }
};

export const fetchManualEvents = async (userId: number, limit: number = 10, offset: number = 0) => {
  try {
    const response = await api.get('/events', {
      params: {
        userId,
        isManual: true,
        limit,
        offset
      }
    });
    return response.data.data;
  } catch (error) {
    console.log('Error fetching manual events:', error);
    throw error;
  }
};


export const getEventById = async (eventId: number) => {
  try {
    const response = await api.get(`/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.log('Error fetching event details:', error);
    throw error;
  }
};

export const getSeatingOptionsByEventId = async (eventId: number) => {
  try {
    const response = await axios.get(avdurl1 + `seating-options/event/${eventId}`);
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch seating options', error);
    throw error;
  }
};

export const getAllFavouriteEvents = async (userId: number) => {
  try {
    const response = await api.get(`/favorites/user/${userId}`);
    return response.data.data;
  } catch (error) {
    console.log('Error fetching favorites:', error);
    throw error;
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
  } catch (error) {
    console.log('Error fetching tickets:', error);
    throw error;
  }
};

// Get notifications by user ID
export const getNotificationsByUserId = async (userId: string) => {
  try {
    const response = await api.get(avdurl1 + `/notifications/user/${userId}`);
    return response.data.data;
  } catch (error: any) {
    console.log('Error fetching notifications:', error);
    throw new Error(error?.response?.data?.message || 'Failed to fetch notifications');
  }
};

export const fetchBannerImages = async () => {
  try {
    const response = await api.get(avdurl1 + 'uploads/bannerImages');
    return response.data.images;
  } catch (error) {
    console.log('Error fetching banner images:', error);
    return null;
  }
};

export const fetchUserById = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  } catch (error) {
    console.log('Error fetching user by ID:', error);
    throw error;
  }
};

export const getChargesByEventId = async (
  eventId: number
) => {
  try {
    const response = await api.get(`charges/event/${eventId}`);
    return response.data.data;
  } catch (error) {
    console.log('Error fetching user by ID:', error);
    throw error;
  }
};

export const markEventAsFavorite = async (body: any) => {
  try {
    const response = await api.post('/favorites', body);
    return response.data;
  } catch (error) {
    console.log('Error marking event as favorite:', error);
    throw error;
  }
};

export const markEventAsDeleteFavorite = async (userId: number, eventId: number) => {
  try {
    const response = await api.delete(`/favorites/user/${userId}/event/${eventId}`);
    return response.data.data;
  } catch (error: any) {
    let errorMessage = 'An unexpected error occurred.';
    
    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorMessage = `Unauthorized access. Please authenticate. Message: ${error.response.data.message}`;
          break;
        case 403:
          errorMessage = `Forbidden access. Message: ${error.response.data.message}`;
          break;
        case 404:
          errorMessage = `Event not found. Message: ${error.response.data.message}`;
          break;
        default:
          errorMessage = `An unexpected error occurred. Message: ${error.response.data.message || error.message}`;
          break;
      }
    } else {
      errorMessage = `Error occurred: ${error.message}`;
    }
    throw new Error(errorMessage);
  }
};

export const updateUserNotifications = async (userId: string, notificationsEnabled: boolean) => {
  try {
    const response = await api.put(avdurl1 + `users/${userId}`, { notificationsEnabled });
    return response.data.data;
  } catch (error) {
    console.log('Error updating notifications:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId: any, userDetails: any) => {
  try {
    const response = await api.put(`/users/${userId}`,userDetails);
    return response.data.data;
  } catch (error) {
    console.log('Error updating userdetails:', error);
    throw error;
  }
};

