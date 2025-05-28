import { configureStore } from "@reduxjs/toolkit";
import activeChatReducer from "./slices/activeChatSlice";

export const store = configureStore({
  reducer: {
    activeChat: activeChatReducer,
  },
});

//Types for usage in components.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
