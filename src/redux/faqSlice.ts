import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { Faq } from "../models/Faq";

export const addFaq = createAsyncThunk(
  "faq/addFaq",
  async (faq: Faq, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/faq/create", faq);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchFaqs = createAsyncThunk(
  "faq/fetchFaqs",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/faq/all-admin");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchFaq = createAsyncThunk(
  "faq/fetchFaq",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/faq/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateFaq = createAsyncThunk(
  "faq/updateFaq",
  async (faq: Faq, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/faq/update/${faq.id}`, faq);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteFaq = createAsyncThunk(
  "faq/deleteFaq",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/faq/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const faqSlice = createSlice({
  name: "faq",
  initialState: {
    faqs: [] as Faq[],
    faq: null as Faq | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.faqs.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add FAQ";
        state.isAdding = false;
      })
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.faqs = action.payload.FaqData;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch FAQs";
      })
      .addCase(deleteFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.faqs = state.faqs.filter(
          (faq: Faq) => faq.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete FAQ";
        state.isDeleting = false;
      })
      .addCase(fetchFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.faq = action.payload.FaqData;
      })
      .addCase(fetchFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch FAQ";
      })
      .addCase(updateFaq.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFaq.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.faq = action.payload;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update FAQ";
      });
  },
});

export default faqSlice.reducer;
