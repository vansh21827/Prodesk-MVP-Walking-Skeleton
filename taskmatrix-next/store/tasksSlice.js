import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [
    {
      id: 1,
      title: "Design dashboard UI",
      description: "Create the main dashboard interface",
      project: "Website Redesign",
      status: "In Progress",
      priority: "High",
      dueDate: "Aug 18, 2026",
      assignee: "Vansh Bansal",
    },
    {
      id: 2,
      title: "Implement authentication",
      description: "Complete login and authentication flow",
      project: "Smart AI Tracker",
      status: "To Do",
      priority: "Medium",
      dueDate: "Aug 20, 2026",
      assignee: "Vansh Bansal",
    },
  ],

  status: "idle",
  error: null,
};

const tasksSlice = createSlice({
  name: "tasks",

  initialState,

  reducers: {
    /*
    |--------------------------------------------------------------------------
    | Add Task
    |--------------------------------------------------------------------------
    */

    addTask: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },

      prepare: (task) => ({
        payload: {
          ...task,
          id: Date.now(),
        },
      }),
    },

    /*
    |--------------------------------------------------------------------------
    | Update Task
    |--------------------------------------------------------------------------
    */

    updateTask: (state, action) => {
      const updatedTask = action.payload;

      const index = state.items.findIndex(
        (task) =>
          String(task.id) === String(updatedTask.id)
      );

      if (index !== -1) {
        state.items[index] = {
          ...state.items[index],
          ...updatedTask,
        };
      }
    },

    /*
    |--------------------------------------------------------------------------
    | Delete Task
    |--------------------------------------------------------------------------
    */

    deleteTask: (state, action) => {
      state.items = state.items.filter(
        (task) =>
          String(task.id) !== String(action.payload)
      );
    },

    /*
    |--------------------------------------------------------------------------
    | Update Task Status
    |--------------------------------------------------------------------------
    */

    updateTaskStatus: (state, action) => {
      const { id, status } = action.payload;

      const task = state.items.find(
        (item) => String(item.id) === String(id)
      );

      if (task) {
        task.status = status;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | Update Task Priority
    |--------------------------------------------------------------------------
    */

    updateTaskPriority: (state, action) => {
      const { id, priority } = action.payload;

      const task = state.items.find(
        (item) => String(item.id) === String(id)
      );

      if (task) {
        task.priority = priority;
      }
    },

    /*
    |--------------------------------------------------------------------------
    | Clear Tasks
    |--------------------------------------------------------------------------
    */

    clearTasks: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  addTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
  updateTaskPriority,
  clearTasks,
} = tasksSlice.actions;

export default tasksSlice.reducer;