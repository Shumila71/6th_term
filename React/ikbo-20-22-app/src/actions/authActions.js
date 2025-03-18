import axios from 'axios';

export const loginUser = (credentials) => async dispatch => {
    try {
        const response = await axios.post('/login', credentials);
        dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.token });
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        console.log(error);
    }
};

export const registerUser = (userData) => async dispatch => {
    try {
        const response = await axios.post('/register', userData);
        dispatch({ type: 'REGISTER_SUCCESS', payload: response.data.token });
        localStorage.setItem('token', response.data.token);
    } catch (error) {
        console.log(error);
    }
};
