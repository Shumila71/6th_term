const initialState = {
  token: null ,
  isAuthenticated: false,
  error: null
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
      case 'LOGIN_SUCCESS':
      case 'REGISTER_SUCCESS':
          return {
              ...state,
              token: action.payload,
              isAuthenticated: true,
              error: null
          };
      case 'LOGIN_FAILURE':
      case 'REGISTER_FAILURE':
          return {
              ...state,
              token: null,
              isAuthenticated: false,
              error: action.payload
          };
      default:
          return state;
  }
};

export default authReducer;