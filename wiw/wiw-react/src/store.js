import { persistStore, persistReducer } from "redux-persist";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./store/slices/userSlice";
import rootReducer from "./reducer"; // 애플리케이션의 리듀서 가져오기
import storageSession from "redux-persist/lib/storage/session"; // 세션 스토리지 사용

// Redux Persist 설정
const persistConfig = {
  key: "root",
  storage: storageSession, // 세션 스토리지를 사용하여 상태를 저장합니다.
  whitelist: ["user"], // 영구 저장을 원하는 리듀서 이름을 배열로 지정합니다.
};

// Persisted reducer 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux store 설정
const store = configureStore({
  reducer: persistedReducer,
});

// Persistor 설정
export const persistor = persistStore(store);

export default store;
