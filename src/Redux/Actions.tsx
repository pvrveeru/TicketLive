// Action types
export const actionTypes = {
    getEventsData: 'GET_EVENTS_DATA',
  };

  // Action creator for getting stores data
  export const getEventsData = (data: any) => {
    return {
      type: actionTypes.getEventsData,
      payload: data,
    };
  };
