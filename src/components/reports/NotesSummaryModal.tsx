import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Note {
  id: string;
  content: string;
  date?: any; // Adjust the type as necessary
}

interface NotesSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotesSummaryModal: React.FC<NotesSummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const q = query(collection(db, 'notes'));
        const querySnapshot = await getDocs(q);
        const notesList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Note[];
        setNotes(notesList);
      } catch (error) {
        console.error('Errore nel recupero delle note:', error);
      }
    };

    fetchNotes();
  }, []);

  const filteredNotes = notes.filter(note => note.content.trim() !== '' && (!note.date || note.date.toDate().toDateString() !== 'Invalid Date'));

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Riepilogo Note</h2>
        {filteredNotes.length > 0 ? (
          <ul className="list-disc list-inside">
            {filteredNotes.map(note => (
              <li key={note.id} className="text-gray-700">
                {note.content}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">Non ci sono note da visualizzare.</p>
        )}
        <button
          onClick={onClose}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Chiudi
        </button>
      </div>
    </div>
  );
};

export default NotesSummaryModal;