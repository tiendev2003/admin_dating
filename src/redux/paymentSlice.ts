import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { Payment } from "../models/Payment";
 
export const addPayment = createAsyncThunk(
  "payment/addPayment",
  async (payment: Payment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payment/create", payment);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/payment/all-admin");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPayment = createAsyncThunk(
  "payment/fetchPayment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/payment/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updatePayment = createAsyncThunk(
  "payment/updatePayment",
  async (payment: Payment, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/payment/update/${payment.id}`,
        payment
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

export const deletePayment = createAsyncThunk(
  "payment/deletePayment",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/payment/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    payments: [] as Payment[],
    payment: null as Payment | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.payments.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add payment";
        state.isAdding = false;
      })
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.payments = action.payload.paymentdata;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch payments";
      })
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.payments = state.payments.filter(
          (payment: Payment) => payment.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete payment";
        state.isDeleting = false;
      })
      .addCase(fetchPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.payment = action.payload.paymentlist;
      })
      .addCase(fetchPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch payment";
      })
      .addCase(updatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.payment = action.payload;
      })
      .addCase(updatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update payment";
      });
  },
});

export default paymentSlice.reducer;
