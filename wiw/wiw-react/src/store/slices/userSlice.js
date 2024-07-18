import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: null,
  userInfo: null,
};

const userSlice = createSlice({
  // 액션 생성자 생성
  name: "user", //리듀서 이름
  initialState,
  reducers: {
    // 액션 생성자를 정의하는 객체 '키 :값 ;
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.userInfo = action.payload.userInfo;
    },
    logout: (state) => {
      state.token = null;
      state.userInfo = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
