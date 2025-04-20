import { Link } from 'react-router-dom';
import { Users, Upload, Calendar, Activity, ChevronRight, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  // Mock data
  const stats = {
    patientsToday: 12,
    pendingUploads: 5,
    upcomingTreatments: 3,
  };

  const upcomingAppointments = [
    { id: 1, name: 'John Doe', time: '10:00 AM', type: 'Follow-up' },
    { id: 2, name: 'Jane Smith', time: '11:30 AM', type: 'Treatment' },
    { id: 3, name: 'Robert Johnson', time: '2:00 PM', type: 'Consultation' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, Dr. Smith</h1>
        <p className="text-blue-100">Here's your overview for today</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Patients Today</p>
              <p className="text-2xl font-bold text-gray-800">{stats.patientsToday}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Link to="/patients" className="flex items-center hover:underline">
              View all patients <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Upload className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Uploads</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingUploads}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-yellow-600">
            <Link to="/upload" className="flex items-center hover:underline">
              Upload studies <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Upcoming Treatments</p>
              <p className="text-2xl font-bold text-gray-800">{stats.upcomingTreatments}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <Link to="/appointments" className="flex items-center hover:underline">
              View schedule <ChevronRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/consultation/new"
              className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">New Consultation</span>
            </Link>
            <Link
              to="/upload"
              className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors"
            >
              <Upload className="w-8 h-8 text-yellow-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">Upload Study</span>
            </Link>
            <Link
              to="/appointments"
              className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
            >
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">Schedule Appointment</span>
            </Link>
            <Link
              to="/reports"
              className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors"
            >
              <AlertCircle className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-800">Generate Report</span>
            </Link>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Today's Schedule</h2>
            <Link to="/appointments" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
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
    </div>
  );
};

export default Dashboard; 