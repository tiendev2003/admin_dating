import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { Interest } from "../models/Interest";

export const addInterest = createAsyncThunk(
  "interest/addInterest",
  async (interest: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/interest/create", interest, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchInterests = createAsyncThunk(
  "interest/fetchInterests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/interest/all-admin");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchInterest = createAsyncThunk(
  "interest/fetchInterest",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/interest/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateInterest = createAsyncThunk(
  "interest/updateInterest",
  async (
    { interest, id }: { interest: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/interest/update/${id}`,
        interest
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

export const deleteInterest = createAsyncThunk(
  "interest/deleteInterest",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/interest/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const interestSlice = createSlice({
  name: "interest",
  initialState: {
    interests: [] as Interest[],
    interest: null as Interest | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addInterest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addInterest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.interests.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add interest";
        state.isAdding = false;
      })
      .addCase(fetchInterests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterests.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log(action.payload);
        state.interests = action.payload.interestlist;
      })
      .addCase(fetchInterests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch interests";
      })
      .addCase(deleteInterest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deleteInterest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.interests = state.interests.filter(
          (interest: Interest) => interest.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deleteInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete interest";
        state.isDeleting = false;
      })
      .addCase(fetchInterest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInterest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.interest = action.payload.interestlist;
      })
      .addCase(fetchInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch interest";
      })
      .addCase(updateInterest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInterest.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.interest = action.payload;
      })
      .addCase(updateInterest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update interest";
      });
  },
});

export default interestSlice.reducer;
