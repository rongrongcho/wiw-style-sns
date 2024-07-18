// src/reducer.js

import { combineReducers } from "redux";
import userReducer from "./store/slices/userSlice";
// 다른 리듀서들도 필요에 따라 추가

const rootReducer = combineReducers({
  user: userReducer,
  // 다른 리듀서들 추가
});

export default rootReducer;
