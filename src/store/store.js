import { createStore, combineReducers } from 'redux';

// 초기 상태
const initialState = {
  deviceId: null,
  device: null,
  currentQuestion: null,
  isLoading: true,
};

// 리듀서
const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DEVICE_ID':
      return { ...state, deviceId: action.payload };
    case 'SET_DEVICE':
      return { ...state, device: action.payload };
    case 'SET_CURRENT_QUESTION':
      return { ...state, currentQuestion: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  app: appReducer,
});

export const store = createStore(rootReducer);

