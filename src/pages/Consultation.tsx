import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Mic, Save } from 'lucide-react';

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
  const [diagnosis, setDiagnosis] = useState(mockPatient.diagnosis);
  const [medication, setMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [notes, setNotes] = useState('');
  const [isRecording, setIsRecording] = useState(false);

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

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement voice-to-text functionality here
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Consultation {id}</h1>

      <div className="bg-white p-6 rounded-lg shadow">
        {/* Patient Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">{mockPatient.name}</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-medium">{mockPatient.age}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Visit</p>
              <p className="font-medium">{mockPatient.lastVisit}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
            >
              <option value="AMD">Age-related Macular Degeneration (AMD)</option>
              <option value="DME">Diabetic Macular Edema (DME)</option>
              <option value="RVO">Retinal Vein Occlusion (RVO)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Medication */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Medication
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={medication}
                onChange={(e) => setMedication(e.target.value)}
              >
                <option value="">Select medication</option>
                <option value="Aflibercept">Aflibercept</option>
                <option value="Ranibizumab">Ranibizumab</option>
                <option value="Bevacizumab">Bevacizumab</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Dosage
              </label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter dosage"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`p-2 rounded-full ${
                  isRecording ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
            <textarea
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={6}
              placeholder="Enter consultation notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Save className="w-5 h-5 mr-2" />
              Save Consultation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Consultation; 