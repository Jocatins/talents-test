// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import knowledgeReducer from '../store/slice';

export const store = configureStore({
  reducer: {
    knowledge: knowledgeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;