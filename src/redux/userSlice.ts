import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { User } from "../models/User";
 
export const addUser = createAsyncThunk(
  "user/addUser",
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/create", user);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/all-admin");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "user/fetchUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/information/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async (user: User, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/user/update/${user.id}`, user);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/user/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "user/fetchUserDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/user/information/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [] as User[],
    user: null as User | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add user";
        state.isAdding = false;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = action.payload.userlist;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.users = state.users.filter(
          (user: User) => user.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete user";
        state.isDeleting = false;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.userlist;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user";
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update user";
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.data;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch user details";
      });
  },
});

export default userSlice.reducer;
