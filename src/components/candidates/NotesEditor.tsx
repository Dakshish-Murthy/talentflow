import React, { useState } from 'react';
import { useCandidates } from '../../hooks/useCandidates';
import MentionsInput from './MentionsInput';

interface NotesEditorProps {
  candidateId: string;
  notes: any[];
}

const NotesEditor: React.FC<NotesEditorProps> = ({ candidateId, notes }) => {
  const { addNote } = useCandidates();
  const [newNote, setNewNote] = useState('');

  const extractMentions = (text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const mentions: string[] = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      mentions.push(match[1]);
    }
    return mentions;
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      await addNote(candidateId, {
        content: newNote,
        author: 'Current User', // This would come from auth context
        mentions: extractMentions(newNote),
        timestamp: new Date(), // Add timestamp
      });
      setNewNote('');
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  // Change from onKeyPress to onKeyDown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent default behavior
      handleAddNote();
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Add Note</h3>
        <MentionsInput
          value={newNote}
          onChange={setNewNote}
          onKeyDown={handleKeyDown} // Use onKeyDown instead of onKeyPress
          placeholder="Type your note here... Use @ to mention team members"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm text-gray-500">
            Press Ctrl+Enter to save
          </span>
          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Note
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notes.map((note) => (
          <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-900">{note.author}</span>
              <span className="text-sm text-gray-500">
                {new Date(note.timestamp || note.createdAt || new Date()).toLocaleDateString()} at{' '}
                {new Date(note.timestamp || note.createdAt || new Date()).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
            {note.mentions && note.mentions.length > 0 && (
              <div className="mt-2">
                <span className="text-xs text-gray-500">Mentioned: </span>
                {note.mentions.map((mention: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800 mr-1"
                  >
                    @{mention}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {notes.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No notes yet. Add the first note above.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesEditor;