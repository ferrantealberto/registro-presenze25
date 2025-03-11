import Modal from 'react-modal';
import { createPortal } from 'react-dom';
import { FileText } from 'lucide-react';

interface NotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: string, printInReport: boolean) => void;
  currentNote: string;
  printInReport: boolean;
  onChange: (note: string) => void;
  onPrintChange: (print: boolean) => void;
}

// Set modal app element once
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

export default function NotesModal({ 
  isOpen,
  onClose,
  onSave,
  currentNote,
  printInReport,
  onChange,
  onPrintChange,
}: NotesModalProps) {

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-xl w-96"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      shouldReturnFocusAfterClose={true}
      preventScroll={true}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000
        },
        content: {
          border: 'none',
          padding: 0,
          background: 'none',
          overflow: 'visible'
        }
      }}
    >
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Note Studente</h2>
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-gray-500 mr-2" />
          </div>
        </div>
        <textarea
          value={currentNote}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-32 p-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Inserisci una nota..."
          autoFocus
        />
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="printInReport"
            checked={printInReport}
            onChange={(e) => onPrintChange(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="printInReport" className="ml-2 block text-sm text-gray-900">
            Includi nella stampa del registro
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Annulla
          </button>
          <button
            onClick={() => onSave(currentNote, printInReport)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Salva
          </button>
        </div>
      </div>
    </Modal>
  );
}
