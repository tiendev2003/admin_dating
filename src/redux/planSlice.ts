import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { Plan } from "../models/Plan";

export const addPlan = createAsyncThunk(
  "plan/addPlan",
  async (plan: Plan, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/plan/create", plan);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPlans = createAsyncThunk(
  "plan/fetchPlans",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/plan/all-admin");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchPlan = createAsyncThunk(
  "plan/fetchPlan",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/plan/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updatePlan = createAsyncThunk(
  "plan/updatePlan",
  async (plan: Plan, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/plan/update/${plan.id}`,
        plan
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

export const deletePlan = createAsyncThunk(
  "plan/deletePlan",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/plan/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const planSlice = createSlice({
  name: "plan",
  initialState: {
    plans: [] as Plan[],
    plan: null as Plan | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.plans.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add plan";
        state.isAdding = false;
      })
      .addCase(fetchPlans.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlans.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.plans = action.payload.PlanData;
      })
      .addCase(fetchPlans.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch plans";
      })
      .addCase(deletePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deletePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.plans = state.plans.filter(
          (plan: Plan) => plan.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deletePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete plan";
        state.isDeleting = false;
      })
      .addCase(fetchPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.plan = action.payload.PlanData;
      })
      .addCase(fetchPlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch plan";
      })
      .addCase(updatePlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlan.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.plan = action.payload;
      })
      .addCase(updatePlan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update plan";
      })
  },
});

export default planSlice.reducer;
