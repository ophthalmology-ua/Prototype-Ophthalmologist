import { Users, Upload, Calendar, Clock, Stethoscope, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();

  const upcomingAppointments = [
    { id: 1, name: 'John Doe', time: '10:00 AM', type: 'Follow-up' },
    { id: 2, name: 'Jane Smith', time: '11:30 AM', type: 'Treatment' },
    { id: 3, name: 'Robert Johnson', time: '2:00 PM', type: 'Consultation' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('welcomeBack')}, Dr. Smith</h1>
        <p className="text-blue-100">{t('overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Patients Today */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{t('patientsToday')}</p>
            <Users className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">12</span>
            <span className="text-sm text-green-500 ml-2">+2.5%</span>
          </div>
        </div>

        {/* Pending Uploads */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{t('pendingUploads')}</p>
            <Upload className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">4</span>
            <span className="text-red-500 text-sm ml-2">+1</span>
          </div>
        </div>

        {/* Upcoming Treatments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{t('upcomingTreatments')}</p>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold">8</span>
            <span className="text-green-500 text-sm ml-2">On track</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Stethoscope className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">{t('newConsultation')}</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Upload className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">{t('uploadStudy')}</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <Calendar className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">{t('scheduleAppointment')}</span>
          </button>
          <button className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <FileText className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-medium text-gray-800">{t('generateReport')}</span>
          </button>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800">{t('todaySchedule')}</h2>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-800">{appointment.name}</p>
                  <p className="text-xs text-gray-500">{appointment.type}</p>
                </div>
              </div>
              <span className="text-sm text-gray-600">{appointment.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 