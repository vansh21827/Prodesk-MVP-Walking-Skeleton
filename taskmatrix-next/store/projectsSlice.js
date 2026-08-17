import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getSession } from "next-auth/react";

const API_URL =
  process.env.NEXT_PUBLIC_TASKMATRIX_API_URL ||
  "http://localhost:5000";

/*
|--------------------------------------------------------------------------
| Get Authentication Headers
|--------------------------------------------------------------------------
*/

const getAuthHeaders = async () => {
  const session = await getSession();

  const token = session?.user?.accessToken;

  if (!token) {
    throw new Error("Authentication token not found. Please login again.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

/*
|--------------------------------------------------------------------------
| Fetch Projects
|--------------------------------------------------------------------------
*/

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/api/projects`,
        {
          method: "GET",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to fetch projects"
        );
      }

      return data.projects || data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to fetch projects"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Create Project
|--------------------------------------------------------------------------
*/

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/api/projects`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(projectData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to create project"
        );
      }

      return data.project || data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to create project"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Update Project
|--------------------------------------------------------------------------
*/

export const updateProjectAsync = createAsyncThunk(
  "projects/updateProject",
  async ({ id, ...projectData }, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "PUT",
          headers,
          body: JSON.stringify(projectData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to update project"
        );
      }

      return data.project || data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update project"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Delete Project
|--------------------------------------------------------------------------
*/

export const deleteProjectAsync = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      const headers = await getAuthHeaders();

      const response = await fetch(
        `${API_URL}/api/projects/${id}`,
        {
          method: "DELETE",
          headers,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to delete project"
        );
      }

      return id;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to delete project"
      );
    }
  }
);

/*
|--------------------------------------------------------------------------
| Initial State
|--------------------------------------------------------------------------
*/

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

/*
|--------------------------------------------------------------------------
| Projects Slice
|--------------------------------------------------------------------------
*/

const projectsSlice = createSlice({
  name: "projects",

  initialState,

  reducers: {
    clearProjects: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      |--------------------------------------------------------------------------
      | Fetch
      |--------------------------------------------------------------------------
      */

      .addCase(fetchProjects.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.error = null;
      })

      .addCase(fetchProjects.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          "Failed to fetch projects";
      })

      /*
      |--------------------------------------------------------------------------
      | Create
      |--------------------------------------------------------------------------
      */

      .addCase(createProject.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.status = "succeeded";

        if (action.payload) {
          state.items.push(action.payload);
        }

        state.error = null;
      })

      .addCase(createProject.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ||
          "Failed to create project";
      })

      /*
      |--------------------------------------------------------------------------
      | Update
      |--------------------------------------------------------------------------
      */

      .addCase(updateProjectAsync.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(
        updateProjectAsync.fulfilled,
        (state, action) => {
          state.status = "succeeded";

          const updatedProject = action.payload;

          const index = state.items.findIndex(
            (project) =>
              String(project._id || project.id) ===
              String(
                updatedProject?._id ||
                  updatedProject?.id
              )
          );

          if (index !== -1) {
            state.items[index] = updatedProject;
          }

          state.error = null;
        }
      )

      .addCase(
        updateProjectAsync.rejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            action.payload ||
            "Failed to update project";
        }
      )

      /*
      |--------------------------------------------------------------------------
      | Delete
      |--------------------------------------------------------------------------
      */

      .addCase(
        deleteProjectAsync.pending,
        (state) => {
          state.status = "loading";
          state.error = null;
        }
      )

      .addCase(
        deleteProjectAsync.fulfilled,
        (state, action) => {
          state.status = "succeeded";

          state.items = state.items.filter(
            (project) =>
              String(project._id || project.id) !==
              String(action.payload)
          );

          state.error = null;
        }
      )

      .addCase(
        deleteProjectAsync.rejected,
        (state, action) => {
          state.status = "failed";
          state.error =
            action.payload ||
            "Failed to delete project";
        }
      );
  },
});

export const { clearProjects } =
  projectsSlice.actions;

export default projectsSlice.reducer;