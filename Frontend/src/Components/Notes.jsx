import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiCopy } from 'react-icons/fi';
import { MdDelete } from 'react-icons/md';

const getSavedNotes = () => {
  const saved = localStorage.getItem('sticky-notes');
  return saved ? JSON.parse(saved) : [];
};

const Notes = () => {
  const [notes, setNotes] = useState(getSavedNotes);

  useEffect(() => {
    localStorage.setItem('sticky-notes', JSON.stringify(notes));
  }, [notes]);

  const randomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for(let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: '',
      x: 100,
      y: 100,
      color: randomColor(), 
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, text) => {
    setNotes(notes.map(note => note.id === id ? { ...note, text } : note));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.error('Deleted the Note');
  };

  const handleDrag = (e, id) => {
    const x = e.clientX - 75;
    const y = e.clientY - 25;
    setNotes(notes.map(note =>
      note.id === id ? { ...note, x, y } : note
    ));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Note copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy note.');
    });
  };

  return (
    <div className="min-h-screen bg-blue-50 p-4 relative">
      <button
        onClick={addNote}
        className="bg-yellow-400 text-white text-lg px-4 py-2 rounded shadow hover:bg-yellow-500"
      >
        + Add Note
      </button>

      {notes.map(note => (
        <div
          key={note.id}
          style={{ top: note.y, left: note.x, backgroundColor: note.color }} 
          className="absolute w-56 h-60 p-3 border shadow-md rounded-md cursor-move"
          onMouseDown={(e) => {
            const onMouseMove = (moveEvent) => handleDrag(moveEvent, note.id);
            const onMouseUp = () => {
              window.removeEventListener('mousemove', onMouseMove);
              window.removeEventListener('mouseup', onMouseUp);
            };
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
          }}
        >
          <textarea
            className="w-full h-40 resize-none p-2 text-base bg-transparent border-none outline-none"
            value={note.text}
            onChange={(e) => updateNote(note.id, e.target.value)}
          />
          <div className="flex justify-between items-center mt-2 text-lg">
            <button
              onClick={() => copyToClipboard(note.text)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <FiCopy /> Copy
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              className="text-red-600 hover:text-red-800 flex items-center gap-1"
            >
              <MdDelete /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
