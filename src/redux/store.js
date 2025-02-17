// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userNodesReducer from "./userNodesSlice"; 

export const store = configureStore({
  reducer: {
    user: userReducer,
    userNodes: userNodesReducer,

  },
});
