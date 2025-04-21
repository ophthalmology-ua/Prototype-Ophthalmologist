import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  Activity, 
  FileText, 
  Eye, 
  AlertCircle,
  ChevronRight,
  Plus
} from 'lucide-react';

interface Treatment {
  date: string;
  type: string;
  notes: string;
  outcome: string;
  nextStepScheduled: boolean;
}

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// Mock data - replace with actual API calls in production
const mockPatient = {
  id: 'P001',
  name: 'John Smith',
  age: 65,
  gender: 'Male',
  contactNumber: '+1 (555) 123-4567',
  email: 'john.smith@email.com',
  diagnosis: 'Age-related Macular Degeneration',
  primaryPhysician: 'Dr. Sarah Wilson',
  lastVisit: '2024-03-15',
  nextAppointment: '2024-04-15',
  status: 'Active',
  treatmentPlan: {
    currentPhase: 'Maintenance',
    medication: 'Aflibercept',
    frequency: 'Every 8 weeks',
    nextStep: 'Follow-up examination',
    nextStepDue: '2024-04-15',
    nextStepScheduled: true
  }
};

const mockTreatmentHistory: Treatment[] = [
  {
    date: '2024-03-15',
    type: 'Intravitreal Injection',
    notes: 'Aflibercept administered in right eye',
    outcome: 'Procedure completed successfully',
    nextStepScheduled: true
  },
  {
    date: '2024-02-01',
    type: 'OCT Examination',
    notes: 'Stable macular thickness',
    outcome: 'No significant changes observed',
    nextStepScheduled: true
  },
  {
    date: '2024-01-15',
    type: 'Intravitreal Injection',
    notes: 'Aflibercept administered in right eye',
    outcome: 'Procedure completed successfully',
    nextStepScheduled: true
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 'A001',
    date: '2024-04-15',
    time: '10:30 AM',
    type: 'Follow-up Examination',
    status: 'scheduled'
  },
  {
    id: 'A002',
    date: '2024-03-15',
    time: '11:00 AM',
    type: 'Intravitreal Injection',
    status: 'completed'
  },
  {
    id: 'A003',
    date: '2024-02-01',
    time: '09:15 AM',
    type: 'OCT Examination',
    status: 'completed'
  }
];

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Patient Profile - ID: {id}</h1>
        {/* Header with Patient Summary */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{mockPatient.name}</h1>
                  <p className="text-blue-100">ID: {mockPatient.id} • {mockPatient.age} years • {mockPatient.gender}</p>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Activity className="w-5 h-5" />
                <div>
                  <p className="text-sm text-blue-100">Diagnosis</p>
                  <p className="font-medium">{mockPatient.diagnosis}</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm text-blue-100">Next Appointment</p>
                  <p className="font-medium">{mockPatient.nextAppointment}</p>
                </div>
              </div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5" />
                <div>
                  <p className="text-sm text-blue-100">Treatment Phase</p>
                  <p className="font-medium">{mockPatient.treatmentPlan.currentPhase}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'history', label: 'Treatment History', icon: FileText },
                { id: 'appointments', label: 'Appointments', icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Patient Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Contact Number</p>
                        <p className="font-medium">{mockPatient.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{mockPatient.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Primary Physician</p>
                        <p className="font-medium">{mockPatient.primaryPhysician}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Last Visit</p>
                        <p className="font-medium">{mockPatient.lastVisit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Treatment Plan */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Treatment Plan</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Medication</p>
                        <p className="font-medium">{mockPatient.treatmentPlan.medication}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Frequency</p>
                        <p className="font-medium">{mockPatient.treatmentPlan.frequency}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">Next Step</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="font-medium">{mockPatient.treatmentPlan.nextStep}</p>
                          {mockPatient.treatmentPlan.nextStepScheduled ? (
                            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                              Scheduled for {mockPatient.treatmentPlan.nextStepDue}
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                              Not Scheduled
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                {mockTreatmentHistory.map((treatment, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-lg font-medium text-gray-900">{treatment.type}</h4>
                        <time className="text-sm text-gray-500">{treatment.date}</time>
                      </div>
                      <p className="mt-1 text-gray-600">{treatment.notes}</p>
                      <p className="mt-1 text-gray-600">{treatment.outcome}</p>
                      {treatment.nextStepScheduled && (
                        <div className="mt-2 flex items-center text-sm text-blue-600">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Next step scheduled</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="space-y-4">
                {mockAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{appointment.type}</h4>
                        <div className="flex items-center mt-1">
                          <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{appointment.date}</span>
                          <span className="mx-2 text-gray-300">•</span>
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-500">{appointment.time}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile; 