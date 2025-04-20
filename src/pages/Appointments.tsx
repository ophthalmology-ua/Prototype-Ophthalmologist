import { useState } from 'react';
import { Calendar, Clock, User, AlertCircle } from 'lucide-react';

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    patientName: 'John Doe',
    date: '2024-04-20',
    time: '09:00',
    type: 'Follow-up',
    urgency: 'Normal',
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    date: '2024-04-20',
    time: '10:30',
    type: 'Treatment',
    urgency: 'Urgent',
  },
  {
    id: 3,
    patientName: 'Robert Johnson',
    date: '2024-04-20',
    time: '14:00',
    type: 'Consultation',
    urgency: 'Normal',
  },
];

const Appointments = () => {
  const [view, setView] = useState('daily');
  const [selectedDate, setSelectedDate] = useState('2024-04-20');

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Urgent':
        return 'bg-red-100 text-red-800';
      case 'Follow-up':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg ${
              view === 'daily'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setView('daily')}
          >
            Daily
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              view === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setView('weekly')}
          >
            Weekly
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${
              view === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setView('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {mockAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {appointment.patientName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {appointment.time}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getUrgencyColor(
                      appointment.urgency
                    )}`}
                  >
                    {appointment.urgency}
                  </span>
                  <span className="text-sm text-gray-500">{appointment.type}</span>
                  <button className="text-blue-600 hover:text-blue-800">
                    <AlertCircle className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Appointment Button */}
      <div className="flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Add Appointment
        </button>
      </div>
    </div>
  );
};

export default Appointments; 