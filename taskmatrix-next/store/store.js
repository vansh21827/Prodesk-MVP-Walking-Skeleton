import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import projectsReducer from "./projectsSlice";
import tasksReducer from "./tasksSlice";
import teamReducer from "./teamSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    tasks: tasksReducer,
    team: teamReducer,
  },
});