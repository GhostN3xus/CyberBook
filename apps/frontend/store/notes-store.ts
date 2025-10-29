'use client';

import { useEffect, useState } from 'react';
import { create } from 'zustand';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface NotesState {
  notes: Record<string, Note>;
  setNote: (id: string, note: Omit<Note, 'id' | 'updatedAt'>) => void;
  deleteNote: (id: string) => void;
}

const NOTES_KEY = 'appsec-warrior-notes';

const usePersistedStore = create<NotesState>((set, get) => ({
  notes: {},
  setNote: (id, note) => {
    const next = {
      ...get().notes,
      [id]: {
        id,
        ...note,
        updatedAt: new Date().toISOString()
      }
    };
    set({ notes: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTES_KEY, JSON.stringify(next));
    }
  },
  deleteNote: (id) => {
    const { [id]: _deleted, ...rest } = get().notes;
    set({ notes: rest });
    if (typeof window !== 'undefined') {
      localStorage.setItem(NOTES_KEY, JSON.stringify(rest));
    }
  }
}));

export function useNotes() {
  const store = usePersistedStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(NOTES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as Record<string, Note>;
      usePersistedStore.setState({ notes: parsed });
    }
    setHydrated(true);
  }, []);

  return { ...store, hydrated };
}
