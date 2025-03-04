const initialState = {
    isAgreed: false,
  };
  
  const agreementReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'TOGGLE_AGREEMENT':
        return {
          ...state,
          isAgreed: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default agreementReducer;