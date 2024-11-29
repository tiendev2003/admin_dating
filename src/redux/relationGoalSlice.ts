import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { RelationGoal } from "../models/RelationGoal";

interface RelationGoalState {
  relationGoals: RelationGoal[];
  relationGoal: RelationGoal | null;
  loading: boolean;
  error: string | null;
  isAdding: boolean;
  isDeleting: boolean;
}

const initialState: RelationGoalState = {
  relationGoals: [],
  relationGoal: null,
  loading: false,
  error: null,
  isAdding: false,
  isDeleting: false,
};

export const fetchRelationGoals = createAsyncThunk(
  "relationGoal/fetchRelationGoals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/relation/all-admin");
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchRelationGoal = createAsyncThunk(
  "relationGoal/fetchRelationGoal",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/relation/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const addRelationGoal = createAsyncThunk(
  "relationGoal/addRelationGoal",
  async (relationGoal: RelationGoal, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/relation/create", relationGoal);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateRelationGoal = createAsyncThunk(
  "relationGoal/updateRelationGoal",
  async (relationGoal: RelationGoal, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        `/relation/update/${relationGoal.id}`,
        relationGoal
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

export const deleteRelationGoal = createAsyncThunk(
  "relationGoal/deleteRelationGoal",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/relation/delete/${id}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const relationGoalSlice = createSlice({
  name: "relationGoal",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelationGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelationGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.relationGoals = action.payload.goallist as RelationGoal[];
      })
      .addCase(fetchRelationGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRelationGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRelationGoal.fulfilled,
        (state, action) => {
          state.loading = false;
          state.relationGoal = action.payload.goallist;
        }
      )
      .addCase(fetchRelationGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addRelationGoal.pending, (state) => {
        state.isAdding = true;
        state.error = null;
      })
      .addCase(
        addRelationGoal.fulfilled,
        (state, action: PayloadAction<RelationGoal>) => {
          state.isAdding = false;
          state.relationGoals.push(action.payload);
        }
      )
      .addCase(addRelationGoal.rejected, (state, action) => {
        state.isAdding = false;
        state.error = action.payload as string;
      })
      .addCase(updateRelationGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateRelationGoal.fulfilled,
        (state, action: PayloadAction<RelationGoal>) => {
          state.loading = false;
          const index = state.relationGoals.findIndex(
            (goal) => goal.id === action.payload.id
          );
          if (index !== -1) {
            state.relationGoals[index] = action.payload;
          }
        }
      )
      .addCase(updateRelationGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteRelationGoal.pending, (state) => {
        state.isDeleting = true;
        state.error = null;
      })
      .addCase(
        deleteRelationGoal.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isDeleting = false;
          state.relationGoals = state.relationGoals.filter(
            (goal) => goal.id !== action.payload
          );
        }
      )
      .addCase(deleteRelationGoal.rejected, (state, action) => {
        state.isDeleting = false;
        state.error = action.payload as string;
      });
  },
});

export default relationGoalSlice.reducer;
