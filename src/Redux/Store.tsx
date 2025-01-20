import {createStore} from 'redux';
import { reducerFunction } from './Reducers';

const store = createStore(reducerFunction);

export default store;
