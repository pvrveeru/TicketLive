// import {createStore} from 'redux';
// import { reducerFunction } from './Reducers';

// const store = createStore(reducerFunction);

// export default store;
import { createStore } from 'redux';
import { reducerFunction } from './Reducers'; // assuming you have a reducer

// Create the Redux store
const store = createStore(reducerFunction);

// Define the RootState type by using the return type of store.getState()
export type RootState = ReturnType<typeof store.getState>;

export default store;
