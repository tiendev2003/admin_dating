
import { configureStore } from '@reduxjs/toolkit';
import faqReducer from './faqSlice';
import interestReducer from './interestSlice';
import languageReducer from './languageSlice';
import paymentReducer from './paymentSlice';
import planReducer from './planSlice';
import relationGoalReducer from './relationGoalSlice';
import religionReducer from './religionSlice';
import userReducer from './userSlice';
 // ...import other slices...

const store = configureStore({
  reducer: {
    religion: religionReducer,
    relationGoal: relationGoalReducer,
    interest: interestReducer,
    plan: planReducer,
    user: userReducer,
    language: languageReducer,
    paymnet: paymentReducer,
    payment: paymentReducer,
    faq : faqReducer,
    // ...add other reducers...
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;