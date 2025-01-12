import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../lib/axios";
import { Language } from "../models/Language";

export const addLanguage = createAsyncThunk(
  "language/addLanguage",
  async (language: FormData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/language/create", language, {
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

export const fetchLanguages = createAsyncThunk(
  "language/fetchLanguages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/language/all-admin");
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

export const fetchLanguage = createAsyncThunk(
  "language/fetchLanguage",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/language/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateLanguage = createAsyncThunk(
  "language/updateLanguage",
  async (
    { language, id }: { language: FormData; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosInstance.put(
        `/language/update/${id}`,
        language,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
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

export const deleteLanguage = createAsyncThunk(
  "language/deleteLanguage",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/language/delete/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const languageSlice = createSlice({
  name: "language",
  initialState: {
    languages: [] as Language[],
    language: null as Language | null,
    loading: false,
    error: null as string | null,
    isAdding: false,
    isDeleting: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isAdding = true;
      })
      .addCase(addLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.languages.push(action.payload);
        state.isAdding = false;
      })
      .addCase(addLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add language";
        state.isAdding = false;
      })
      .addCase(fetchLanguages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguages.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.languages = action.payload.languagelist;
      })
      .addCase(fetchLanguages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch languages";
      })
      .addCase(deleteLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.isDeleting = true;
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.languages = state.languages.filter(
          (language: Language) => language.id !== action.payload.id
        );
        state.isDeleting = false;
      })
      .addCase(deleteLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to delete language";
        state.isDeleting = false;
      })
      .addCase(fetchLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.language = action.payload.languagelist;
      })
      .addCase(fetchLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch language";
      })
      .addCase(updateLanguage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.language = action.payload;
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to update language";
      });
  },
});

export default languageSlice.reducer;
