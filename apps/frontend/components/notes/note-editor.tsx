'use client';

import { useNotes } from '../../store/notes-store';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import { Button } from '../ui/button';

interface Props {
  noteId: string;
  title: string;
}

export function NoteEditor({ noteId, title }: Props) {
  const { t } = useTranslation('common');
  const { notes, setNote, deleteNote, hydrated } = useNotes();
  const existing = notes[noteId];
  const [value, setValue] = useState(existing?.content ?? '');

  if (!hydrated) {
    return null;
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-brand-neon">{title}</h4>
        {existing && (
          <button className="text-xs text-red-400" onClick={() => deleteNote(noteId)}>
            Delete
          </button>
        )}
      </div>
      <textarea
        className="mt-3 h-32 w-full rounded-md border border-slate-700 bg-slate-950/60 p-3 text-sm text-slate-200 focus:border-brand-neon focus:outline-none"
        placeholder="Adicione notas locais..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="mt-3 flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={() => {
            setValue(existing?.content ?? '');
          }}
        >
          {t('actions.cancel')}
        </Button>
        <Button
          onClick={() =>
            setNote(noteId, {
              title,
              content: value
            })
          }
        >
          {t('actions.save')}
        </Button>
      </div>
    </div>
  );
}
