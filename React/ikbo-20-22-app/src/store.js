import { createStore, applyMiddleware,combineReducers  } from 'redux';
import { thunk } from 'redux-thunk'; 
import agreementReducer from './reducers/reducers';
import authReducer from './reducers/authReducer';

const root = combineReducers({
    auth: authReducer, // authReducer управляет state.auth
    agree: agreementReducer
});
const store = createStore(
    root,
    applyMiddleware(thunk)
); 

export default store;