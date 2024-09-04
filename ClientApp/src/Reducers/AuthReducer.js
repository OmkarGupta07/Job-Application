const initialState = {
    isAuthenticated: false,
    user: null,
    error: null,
  };
 
  
  export default function authReducer(state = initialState, action) {
    switch (action.type) {
      case 'SIGNUP_SUCCESS':
      case 'LOGIN_SUCCESS':
        return { ...state, isAuthenticated: true, user: action.payload };
      case 'SIGNUP_FAIL':
      case 'LOGIN_FAIL':
        return { ...state, error: action.payload };
      default:
        return state;
    }
  }
 
  
