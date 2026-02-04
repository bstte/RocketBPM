import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import userNodesReducer from "./userNodesSlice";
import mapDataReducer from "./mapDataSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    userNodes: userNodesReducer,
    mapData: mapDataReducer,
  },
});
