
import { createSlice } from '@reduxjs/toolkit';
import type { KnowledgeState } from '../types';
import { createKnowledgeEntry, deleteKnowledgeEntry, fetchKnowledgeEntries, fetchKnowledgeEntryById, updateKnowledgeEntry } from './thunk';


const initialState: KnowledgeState = {
  entries: [],
  selectedEntry: null,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

const knowledgeSlice = createSlice({
  name: 'knowledge',
  initialState,
  reducers: {
    clearSelectedEntry: (state) => {
      state.selectedEntry = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all entries
      .addCase(fetchKnowledgeEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeEntries.fulfilled, (state, action) => {
        state.loading = false;
        state.entries = action.payload;
      })
      .addCase(fetchKnowledgeEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch entry by ID
      .addCase(fetchKnowledgeEntryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKnowledgeEntryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEntry = action.payload;
      })
      .addCase(fetchKnowledgeEntryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create entry
      .addCase(createKnowledgeEntry.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createKnowledgeEntry.fulfilled, (state, action) => {
        state.createLoading = false;
        state.entries.push(action.payload);
      })
      .addCase(createKnowledgeEntry.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload as string;
      })

      // Update entry
      .addCase(updateKnowledgeEntry.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateKnowledgeEntry.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.entries.findIndex(entry => entry.id === action.payload.id);
        if (index !== -1) {
          state.entries[index] = action.payload;
        }
        if (state.selectedEntry?.id === action.payload.id) {
          state.selectedEntry = action.payload;
        }
      })
      .addCase(updateKnowledgeEntry.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload as string;
      })

      // Delete entry
      .addCase(deleteKnowledgeEntry.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteKnowledgeEntry.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.entries = state.entries.filter(entry => entry.id !== action.payload);
        if (state.selectedEntry?.id === action.payload) {
          state.selectedEntry = null;
        }
      })
      .addCase(deleteKnowledgeEntry.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

export const { clearSelectedEntry, clearErrors } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;