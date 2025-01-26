// Action types
export const actionTypes = {
    getEventsData: 'GET_EVENTS_DATA',
    MobileNumber: 'MOBILE_NUMBER',
    getUserData: 'GET_USER_DATA',
    getOtpData: 'GET_OTP_DATA',
  };

  // Action creator for getting stores data
  export const getEventsData = (data: any) => {
    return {
      type: actionTypes.getEventsData,
      payload: data,
    };
  };

  export const MobileNumber = (data: any) => ({
    type: actionTypes.MobileNumber,
    payload: data,
  });

  export const getOtpData = (data: any) => {
    return {
      type: actionTypes.getOtpData,
      payload: data,
    };
  };

  export const getUserData = (data: any) => {
    return {
      type: actionTypes.getUserData,
      payload: data,
    };
  };
  

