import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import authReducer from './Reducers/AuthReducer';
import jobReducer from './Reducers/JobReducer';
const rootReducer = combineReducers({
  auth: authReducer,
  job:jobReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
