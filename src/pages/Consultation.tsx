import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

// Mock patient data
const mockPatient = {
  id: 1,
  name: 'John Doe',
  age: 65,
  diagnosis: 'AMD',
  lastVisit: '2024-04-15',
};

const Consultation = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const [diagnosis] = useState(mockPatient.diagnosis);
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      diagnosis,
      medication,
      dosage,
      notes,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('consultation')} {id}</h1>
      </div>

      {/* Patient Info Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">{t('name')}</p>
            <p className="font-medium">John Doe</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('age')}</p>
            <p className="font-medium">45 {t('years')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('lastVisit')}</p>
            <p className="font-medium">2024-03-15</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('diagnosis')}</p>
            <p className="font-medium">Diabetic Retinopathy</p>
          </div>
        </div>
      </div>

      {/* Consultation Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('notes')}
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('enterNotes')}
            />
          </div>

          {/* Medication */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('medication')}
            </label>
            <input
              type="text"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('enterMedication')}
            />
          </div>

          {/* Dosage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('dosage')}
            </label>
            <input
              type="text"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={t('enterDosage')}
            />
          </div>

          {/* Next Appointment */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('nextAppointment')}
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button type="button" className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
              {t('cancel')}
            </button>
            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">
              {t('saveConsultation')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Consultation; 