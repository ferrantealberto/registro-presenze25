import { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { doc, updateDoc } from 'firebase/firestore'; 
import { differenceInMinutes } from 'date-fns';
import { db } from '../../lib/firebase';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Lesson {
  id: string;
  date: { toDate: () => Date };
  startTime: string;
  endTime: string;
  school: string;
  class: string;
  hours: number;
  attendanceVerified: boolean;
  notes?: string;
  printNotes?: boolean;
  isNote?: boolean;
}

interface EditLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson;
  onLessonUpdated: () => void;
}

interface FormData {
  date: string;
  startTime: string;
  endTime: string;
  school: string;
  class: string;
  hours: number;
  isManualHours: boolean;
  attendanceVerified: boolean;
  notes: string;
  printNotes: boolean;
}

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1001
  },
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    width: '500px',
    padding: 0,
    border: 'none',
    borderRadius: '0.5rem',
    background: '#fff'
  }
};

if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

const schools = ['Pitagora', 'Falcone'] as const;
const classes = {
  Pitagora: ['4ASA', '4FSA', '4C', '4A'],
  Falcone: ['4AX', '4BX']
} as const;

export default function EditLessonModal({ isOpen, onClose, lesson, onLessonUpdated }: EditLessonModalProps) {
  const [formData, setFormData] = useState<FormData>({
    date: format(new Date(), 'yyyy-MM-dd'),
    startTime: '08:00',
    endTime: '12:00',
    school: '',
    class: '',
    hours: 4,
    isManualHours: false,
    attendanceVerified: false,
    notes: '',
    printNotes: false
  });

  useEffect(() => {
    if (lesson) {
      const lessonDate = lesson.date?.toDate();
      setFormData({
        date: lessonDate ? format(lessonDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        startTime: lesson.startTime || '08:00',
        endTime: lesson.endTime || '12:00',
        school: lesson.school || '',
        class: lesson.class || '',
        hours: lesson.hours || 4,
        isManualHours: false,
        attendanceVerified: Boolean(lesson.attendanceVerified),
        notes: lesson.notes || '',
        printNotes: lesson.printNotes || false
      });
    }
  }, [lesson]);

  const calculateHours = (start: string, end: string): number => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startDate = new Date(2000, 0, 1, startHour, startMinute);
    const endDate = new Date(2000, 0, 1, endHour, endMinute);
    
    const diffMinutes = differenceInMinutes(endDate, startDate);
    return Math.round((diffMinutes / 60) * 100) / 100;
  };

  useEffect(() => {
    if (!formData.isManualHours) {
      const calculatedHours = calculateHours(formData.startTime, formData.endTime);
      setFormData(prev => ({ ...prev, hours: calculatedHours }));
    }
  }, [formData.startTime, formData.endTime, formData.isManualHours]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.date || !formData.startTime || !formData.endTime || !formData.school || !formData.class) {
      toast.error('Compila tutti i campi obbligatori');
      return;
    }

    try {
      const updateData = lesson.isNote ? {
        notes: formData.notes,
        printNotes: formData.printNotes
      } : {
        date: new Date(formData.date),
        startTime: formData.startTime,
        endTime: formData.endTime,
        school: formData.school,
        class: formData.class,
        hours: Number(formData.hours.toFixed(2)),
        attendanceVerified: formData.attendanceVerified
      };

      await updateDoc(doc(db, 'lessons', lesson.id), updateData);
      toast.success(lesson.isNote ? 'Note aggiornate con successo' : 'Lezione aggiornata con successo');
      onLessonUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating lesson:', error);
      toast.error(lesson.isNote ? 'Errore durante l\'aggiornamento delle note' : 'Errore durante l\'aggiornamento della lezione');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={modalStyles}
    >
      <div className="flex flex-col">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              {lesson.isNote ? 'Modifica Note' : 'Modifica Lezione'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full"
              type="button"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {lesson.isNote ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Note
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  rows={4}
                  placeholder="Inserisci le note per questa lezione..."
                />
              </div>
              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.printNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, printNotes: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-700">
                    Includi nella stampa
                  </span>
                </label>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ora Inizio <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Ora Fine <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ore {!formData.isManualHours && <span className="text-xs text-gray-500">(calcolate automaticamente)</span>}
                </label>
                <div className="mt-1 relative">
                  <input
                    type="number"
                    value={formData.hours}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      if (value >= 0) {
                        setFormData(prev => ({
                          ...prev,
                          hours: value,
                          isManualHours: true
                        }));
                      }
                    }}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                      formData.isManualHours ? 'border-yellow-500' : 'border-gray-300'
                    }`}
                    required
                    min="0.01"
                    step="0.01"
                    title={formData.isManualHours ? 'Valore inserito manualmente' : 'Valore calcolato automaticamente'}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        isManualHours: !prev.isManualHours,
                        hours: !prev.isManualHours ? prev.hours : calculateHours(prev.startTime, prev.endTime)
                      }));
                    }}
                    className="absolute right-2 top-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    {formData.isManualHours ? 'Calcola' : 'Modifica'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {formData.isManualHours 
                    ? 'Modalità manuale: inserisci il numero di ore desiderato' 
                    : `Calcolato da ${formData.startTime} a ${formData.endTime}`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Presenze Verificate
                </label>
                <div className="mt-1">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.attendanceVerified}
                      onChange={(e) => setFormData(prev => ({ ...prev, attendanceVerified: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-700">
                      {formData.attendanceVerified ? 'Sì' : 'No'}
                    </span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.school}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    school: e.target.value,
                    class: ''
                  }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleziona una scuola</option>
                  {schools.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.class}
                  onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value }))}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Seleziona una classe</option>
                  {formData.school &&
                    classes[formData.school as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Salva
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
