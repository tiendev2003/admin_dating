import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { Religion } from "../models/Religion";

export const addReligion = createAsyncThunk(
  "religion/addReligion",
  async (religion: Religion, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/religion/create", religion);
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchReligions = createAsyncThunk(
  "religion/fetchReligions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/religion/all-admin");
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchReligion = createAsyncThunk(
  "religion/fetchReligion",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/religion/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateReligion = createAsyncThunk(
  "religion/updateReligion",
  async (religion: Religion, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/religion/update/${religion.id}`,
        religion
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteReligion = createAsyncThunk(
  "religion/deleteReligion",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/religion/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const religionSlice = createSlice({
  name: "religion",
  initialState: {
    religions: [] as Religion[],
    religion: null as Religion | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addReligion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addReligion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.religions.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addReligion.rejected, (state, action) => {
        state.loading = false;
        console.log(action.error);
        state.error = action.error.message || "Failed to add religion";
        state.isAdding = false;
      })
      .addCase(fetchReligions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReligions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.religions = action.payload.religionlist;
      })
      .addCase(fetchReligions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch religions";
      })
      .addCase(deleteReligion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deleteReligion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.religions = state.religions.filter(
          (religion: Religion) => religion.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deleteReligion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete religion";
        state.isDeleting = false;
      })
      .addCase(fetchReligion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReligion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.religion = action.payload.religionlist;
      })
      .addCase(fetchReligion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch religion";
      })
      .addCase(updateReligion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReligion.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.religion = action.payload;
      })
      .addCase(updateReligion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update religion";
      })

  },
});

export default religionSlice.reducer;
