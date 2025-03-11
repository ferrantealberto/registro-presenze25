import { saveAs } from 'file-saver';
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

function exportStudents(students: any[]) {
  const formattedStudents = students.map(student => ({
    ...student,
    className: student.class || '',
    school: 'Scuola del Registro'
  }));

  const exportFormats = {
    json: () => {
      const content = JSON.stringify(formattedStudents, null, 2);
            <div className="flex gap-4 mb-4">
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={() => {
                  if (students.length === 0) return;
                  
                  const formats = exportStudents(students);
                  
                  Object.entries(formats).forEach(([format, exporter]) => {
                    try {
                      const blob = exporter();
                      saveAs(blob, `class-export.${format}`);
                    } catch (error) {
                      alert(`Errore durante l'esportazione in formato ${format}`);
                    }
                  });
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 13V4M7 14H5a1 1 0 01-1-1V7a1 1 0 011-1h5V2H7a1 1 0 00-1 1v5a1 1 0 01-1 1H5a1 1 0 00-1 1v7a1 1 0 001 1h5v2z"
                  />
                </svg>
                Esporta elenco
              </button>
            </div>

      return new Blob([content], { type: 'application/json' });
    },
    csv: () => {
      const headers = ['ID,Name,Surname,Class,School\n'];
      const rows = formattedStudents.map(student => 
        `${student.id},${student.name},${student.surname},${student.className},${student.school}\n`
      ).join('');
      return new Blob([headers + rows], { type: 'text/csv' });
    },
    xml: () => {
      const xmlContent = `
        <?xml version="1.0" encoding="UTF-8"?>
        <students>
          ${formattedStudents.map(student => `
            <student>
              <id>${student.id}</id>
              <name>${student.name}</name>
              <surname>${student.surname}</surname>
              <class>${student.className}</class>
              <school>${student.school}</school>
            </student>
          `).join('')}
        </students>
      `;
      return new Blob([xmlContent], { type: 'application/xml' });
    }
  };

  return exportFormats;
}
    const handleExport = (format: string) => {
      const data = students.map(student => ({
        nome: student.name,
        cognome: student.surname,
        classe: selectedClass,
        scuola: selectedSchool
      }));

      const exportData = (content: string, type: string) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      };

      if (format === 'csv') {
        import('papaparse').then(papa => {
          const csv = papa.unparse(data);
          exportData(csv, 'text/csv');
        });
      } else if (format === 'xml') {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
          <elenco>
            ${data.map(student => `
              <studente>
                <nome>${student.nome}</nome>
                <cognome>${student.cognome}</cognome>
                <classe>${student.classe}</classe>
                <scuola>${student.scuola}</scuola>
              </studente>
            `).join('')}
          </elenco>`;
        exportData(xml, 'text/xml');
      } else if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        exportData(jsonString, 'application/json');
      }
      
      setShowExportModal(false);
    };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudent] = useState<Student[]>([]);
  const [load, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const school = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudent();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const q = query
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student);
      setStudent(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetch student:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId);
      toast.success('Studente eliminato con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error delete student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students, studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditStudent(null);
      setEditedName('');
      fetchStudent();
    } catch (error) {
      console.error('Error update student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex item-center justify-between">
            <div className="flex item-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudent([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {school.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudent([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex item-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex item-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {load ? (
              <div className="flex justify-center item-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex item-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex item-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex item-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
</final_file_content>

Try again with fewer/more precise Search blocks.
(If you run into this error two times in a row, you may use the write_to_file tool as a fallback.)
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FiDownload, FiFileXml, FiFile Csv, FiFileJson } from 'react-icons/fi';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Trash2, Plus, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  surname: string;
  class: string;
  school: string;
}

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'csv' | 'xml' | 'json'>('csv');

  const handleExport = (format: 'csv' | 'xml' | 'json') => {
    if (!students.length) return;
    
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    try {
      if (format === 'csv') {
        import('papaparse').then(papa => {
          const csv = papa.unparse(data);
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `elenco-${selectedClass}-${selectedSchool}.csv`;
          a.click();
          URL.revokeObjectURL(url);
        });
      } else if (format === 'xml') {
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
          <elenco>
            ${data.map(student => `
              <studente>
                <nome>${student.nome}</nome>
                <cognome>${student.cognome}</cognome>
                <classe>${student.classe}</classe>
                <scuola>${student.scuola}</scuola>
              </studente>
            `).join('')}
          </elenco>`;
        const blob = new Blob([xml], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.xml`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (format === 'json') {
        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Errore durante l\'esportazione');
    } finally {
      setShowExportModal(false);
    }
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const schools = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudents();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student));
      setStudents(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId));
      toast.success('Studente eliminato con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditingStudent(null);
      setEditedName('');
      fetchStudents();
    } catch (error) {
      console.error('Error updating student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudents([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudents([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <>
                  <form onSubmit={handleAddStudent} className="flex items-end space-x-2 mb-4">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    <FiDownload className="h-4 w-4 mr-2" />
                    Esporta
                  </button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <>
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Studenti di {selectedClass} - {selectedSchool}
                  </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex items-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                              <button
                                onClick={() => setSelectedFormat('xml')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'xml' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                XML
                              </button>
                              <button
                                onClick={() => setSelectedFormat('json')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'json' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                JSON
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudent] = useState<Student[]>([]);
  const [load, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const school = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudent();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const q = query
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student);
      setStudent(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetch student:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId);
      toast.success('Studente eliminato con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error delete student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students, studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditStudent(null);
      setEditedName('');
      fetchStudent();
    } catch (error) {
      console.error('Error update student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex item-center justify-between">
            <div className="flex item-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudent([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {school.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudent([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex item-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex item-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {load ? (
              <div className="flex justify-center item-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex item-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex item-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex item-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
</final_file_content>

Try again with fewer/more precise Search blocks.
(If you run into this error two times in a row, you may use the write_to_file tool as a fallback.)
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FiDownload } from 'react-icons/fi';
import { 
  collection, 
  getDocs, 
  query, 
  where,
  addDoc,
  deleteDoc,
  doc,
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  Trash2, 
  Plus, 
  ArrowLeft, 
  Edit2, 
  Check, 
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  surname: string;
  class: string;
  school: string;
}

export default function StudentManagement() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const schools = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudents();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student));
      setStudents(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId));
      toast.success('Studente eliminato con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditingStudent(null);
      setEditedName('');
      fetchStudents();
    } catch (error) {
      console.error('Error updating student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudents([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudents([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex items-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                              <button
                                onClick={() => setSelectedFormat('xml')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'xml' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                XML
                              </button>
                              <button
                                onClick={() => setSelectedFormat('json')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'json' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                JSON
                              </button>
                              <button
                                onClick={() => setSelectedFormat('csv')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'csv' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                CSV
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudent] = useState<Student[]>([]);
  const [load, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const school = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudent();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const q = query
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student);
      setStudent(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetch student:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId);
      toast.success('Studente eliminato con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error delete student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students, studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditStudent(null);
      setEditedName('');
      fetchStudent();
    } catch (error) {
      console.error('Error update student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex item-center justify-between">
            <div className="flex item-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudent([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {school.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudent([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex item-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex item-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {load ? (
              <div className="flex justify-center item-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex item-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex item-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex item-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
</final_file_content>

Try again with fewer/more precise Search blocks.
(If you run into this error two times in a row, you may use the write_to_file tool as a fallback.)
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FiDownload } from 'react-icons/fi';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Trash2, Plus, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  surname: string;
  class: string;
  school: string;
}

  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const schools = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudents();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student));
      setStudents(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId));
      toast.success('Studente eliminato con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditingStudent(null);
      setEditedName('');
      fetchStudents();
    } catch (error) {
      console.error('Error updating student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudents([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudents([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex items-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                              <button
                                onClick={() => setSelectedFormat('xml')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'xml' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                XML
                              </button>
                              <button
                                onClick={() => setSelectedFormat('json')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'json' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                JSON
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudent] = useState<Student[]>([]);
  const [load, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const school = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudent();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const q = query
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student);
      setStudent(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetch student:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId);
      toast.success('Studente eliminato con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error delete student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students, studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditStudent(null);
      setEditedName('');
      fetchStudent();
    } catch (error) {
      console.error('Error update student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex item-center justify-between">
            <div className="flex item-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudent([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {school.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudent([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex item-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex item-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {load ? (
              <div className="flex justify-center item-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex item-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex item-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex item-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
</final_file_content>

Try again with fewer/more precise Search blocks.
(If you run into this error two times in a row, you may use the write_to_file tool as a fallback.)
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FiDownload } from 'react-icons/fi';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Trash2, Plus, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  surname: string;
  class: string;
  school: string;
}

export default function StudentManagement() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const schools = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudents();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student));
      setStudents(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId));
      toast.success('Studente eliminato con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditingStudent(null);
      setEditedName('');
      fetchStudents();
    } catch (error) {
      console.error('Error updating student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudents([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudents([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex items-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                              <button
                                onClick={() => setSelectedFormat('xml')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'xml' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                XML
                              </button>
                              <button
                                onClick={() => setSelectedFormat('json')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'json' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                JSON
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex items-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                              <button
                                onClick={() => setSelectedFormat('xml')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'xml' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                XML
                              </button>
                              <button
                                onClick={() => setSelectedFormat('json')}
                                className={`w-full text-left p-3 rounded ${
                                  selectedFormat === 'json' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
                                }`}
                              >
                                JSON
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudent] = useState<Student[]>([]);
  const [load, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const school = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudent();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudent = async () => {
    setLoading(true);
    try {
      const q = query
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student);
      setStudent(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetch student:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId);
      toast.success('Studente eliminato con successo');
      fetchStudent();
    } catch (error) {
      console.error('Error delete student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students, studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditStudent(null);
      setEditedName('');
      fetchStudent();
    } catch (error) {
      console.error('Error update student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex item-center justify-between">
            <div className="flex item-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudent([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {school.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudent([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex item-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex item-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {load ? (
              <div className="flex justify-center item-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex item-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex item-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex item-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <button
                              onClick={() => handleDeleteStudent(student.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Elimina studente"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
</div>
</final_file_content>

Try again with fewer/more precise Search blocks.
(If you run into this error two times in a row, you may use the write_to_file tool as a fallback.)
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FiDownload } from 'react-icons/fi';
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Trash2, Plus, ArrowLeft, Edit2, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  name: string;
  surname: string;
  class: string;
  school: string;
}

export default function StudentManagement() {
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const handleExport = (format: string) => {
    const data = students.map(student => ({
      nome: student.name,
      cognome: student.surname,
      classe: selectedClass,
      scuola: selectedSchool
    }));

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

    if (format === 'csv') {
      import('papaparse').then(papa => {
        const csv = papa.unparse(data);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      });
    } else if (format === 'xml') {
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <elenco>
          ${data.map(student => `
            <studente>
              <nome>${student.nome}</nome>
              <cognome>${student.cognome}</cognome>
              <classe>${student.classe}</classe>
              <scuola>${student.scuola}</scuola>
            </studente>
          `).join('')}
        </elenco>`;
      const blob = new Blob([xml], { type: 'text/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'json') {
      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `elenco-${selectedClass}-${selectedSchool}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    }
    
    setShowExportModal(false);
  };

  const [selectedSchool, setSelectedSchool] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');
  const navigate = useNavigate();

  const schools = ['Pitagora', 'Falcone'];
  const classes = {
    Pitagora: ['4ASA', '4FSA', '4C', '4A'],
    Falcone: ['4AX', '4BX']
  };

  useEffect(() => {
    if (selectedSchool && selectedClass) {
      fetchStudents();
    }
  }, [selectedSchool, selectedClass]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, 'students'),
        where('school', '==', selectedSchool),
        where('class', '==', selectedClass)
      );
      const querySnapshot = await getDocs(q);
      const studentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        name: doc.data().name || ''
      } as Student));
      setStudents(studentsList.sort((a, b) =>
        (a.name || '').localeCompare(b.name || '')
      ));
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Errore nel recupero degli studenti');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedSchool || !selectedClass) {
      toast.error('Inserisci tutti i campi richiesti');
      return;
    }

    try {
      await addDoc(collection(db, 'students'), {
        name: newStudentName.trim(),
        school: selectedSchool,
        class: selectedClass
      });
      setNewStudentName('');
      toast.success('Studente aggiunto con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Errore durante l\'aggiunta dello studente');
    }
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo studente?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'students', studentId));
      toast.success('Studente eliminato con successo');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast.error('Errore durante l\'eliminazione dello studente');
    }
  };

  const handleEditStart = (student: Student) => {
    setEditingStudent(student.id);
    setEditedName(student.name);
  };

  const handleEditCancel = () => {
    setEditingStudent(null);
    setEditedName('');
  };

  const handleEditSave = async (studentId: string) => {
    if (!editedName.trim()) {
      toast.error('Il nome non può essere vuoto');
      return;
    }

    try {
      await updateDoc(doc(db, 'students', studentId), {
        name: editedName.trim()
      });
      toast.success('Nome studente aggiornato con successo');
      setEditingStudent(null);
      setEditedName('');
      fetchStudents();
    } catch (error) {
      console.error('Error updating student name:', error);
      toast.error('Errore durante l\'aggiornamento del nome');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/')}
                className="mr-4 text-gray-600 hover:text-gray-900"
                title="Torna alla home"
                aria-label="Torna alla home"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestione Studenti
              </h1>
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Scuola
                </label>
                <select
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.target.value);
                    setSelectedClass('');
                    setStudents([]);
                  }}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona scuola"
                  aria-label="Seleziona scuola"
                >
                  <option value="">Seleziona una scuola</option>
                  {schools.map((school) => (
                    <option key={school} value={school}>
                      {school}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Classe
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setStudents([]);
                  }}
                  disabled={!selectedSchool}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  title="Seleziona classe"
                  aria-label="Seleziona classe"
                >
                  <option value="">Seleziona una classe</option>
                  {selectedSchool &&
                    classes[selectedSchool as keyof typeof classes].map((cls) => (
                      <option key={cls} value={cls}>
                        {cls}
                      </option>
                    ))}
                </select>
              </div>

              {selectedSchool && selectedClass && (
                <form onSubmit={handleAddStudent} className="flex items-end space-x-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700">
                      Nuovo Studente
                    </label>
                    <input
                      type="text"
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="Nome e Cognome"
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Aggiungi
                  </button>
                </form>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : selectedSchool && selectedClass ? (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Studenti di {selectedClass} - {selectedSchool}
                </h3>
                {students.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {students.map((student) => (
                      <li
                        key={student.id}
                        className="py-4 flex items-center justify-between"
                        title="Clicca sull'icona della matita per modificare il nome"
                      >
                        <div className="flex items-center">
                          <Users className="h-5 w-5 text-gray-400 mr-3" />
                          {editingStudent === student.id ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="px-2 py-1 border rounded-md text-sm"
                                placeholder="Es. Mario Rossi"
                                title="Modifica nome studente"
                                aria-label="Modifica nome studente"
                                autoFocus
                              />
                </div>
            </div>
                </div>
                          )}
                        </div>
                        {editingStudent !== student.id && (
                          <button
                            onClick={() => handleDeleteStudent(student.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Elimina studente"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    Nessuno studente trovato in questa classe
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Seleziona una scuola e una classe per visualizzare gli studenti
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
