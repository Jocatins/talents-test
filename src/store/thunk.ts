import { createAsyncThunk } from '@reduxjs/toolkit';
import { knowledgeApi } from '../services/api';
import type { KnowledgeEntry } from '../types';


export const fetchKnowledgeEntries = createAsyncThunk(
  'knowledge/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const entries = await knowledgeApi.getEntries();
      return entries;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch entries');
    }
  }
);

export const fetchKnowledgeEntryById = createAsyncThunk(
  'knowledge/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const entry = await knowledgeApi.getEntryById(id);
      return entry;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch entry');
    }
  }
);

export const createKnowledgeEntry = createAsyncThunk(
  'knowledge/create',
  async (entryData: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'views'>, { rejectWithValue }) => {
    try {
      const newEntry = await knowledgeApi.createEntry(entryData);
      return newEntry;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create entry');
    }
  }
);

export const updateKnowledgeEntry = createAsyncThunk(
  'knowledge/update',
  async ({ id, entryData }: { id: string; entryData: Partial<KnowledgeEntry> }, { rejectWithValue }) => {
    try {
      const updatedEntry = await knowledgeApi.updateEntry(id, entryData);
      return updatedEntry;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update entry');
    }
  }
);

export const deleteKnowledgeEntry = createAsyncThunk(
  'knowledge/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await knowledgeApi.deleteEntry(id);
      return id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete entry');
    }
  }
);