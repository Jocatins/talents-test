import type { KnowledgeEntry } from "../types";


const API_BASE_URL = 'http://localhost:3001';

export const knowledgeApi = {
  // GET all entries
  async getEntries(): Promise<KnowledgeEntry[]> {
    const response = await fetch(`${API_BASE_URL}/knowledgeEntries`);
    if (!response.ok) {
      throw new Error('Failed to fetch entries');
    }
    return response.json();
  },

  // GET single entry
  async getEntryById(id: string): Promise<KnowledgeEntry> {
    const response = await fetch(`${API_BASE_URL}/knowledgeEntries/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch entry');
    }
    return response.json();
  },

  // POST new entry
  async createEntry(entryData: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'views'>): Promise<KnowledgeEntry> {
    const newEntry = {
      ...entryData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      views: 0
    };

    const response = await fetch(`${API_BASE_URL}/knowledgeEntries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntry),
    });

    if (!response.ok) {
      throw new Error('Failed to create entry');
    }
    return response.json();
  },

  // PUT update entry
  async updateEntry(id: string, entryData: Partial<KnowledgeEntry>): Promise<KnowledgeEntry> {
    const response = await fetch(`${API_BASE_URL}/knowledgeEntries/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(entryData),
    });

    if (!response.ok) {
      throw new Error('Failed to update entry');
    }
    return response.json();
  },

  // DELETE entry
  async deleteEntry(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/knowledgeEntries/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete entry');
    }
  },
};