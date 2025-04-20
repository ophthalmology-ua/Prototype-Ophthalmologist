import { useState } from 'react';
import { FileText, Download, Edit2 } from 'lucide-react';

// Mock reports data
const mockReports = [
  {
    id: 1,
    type: 'Clinical Summary',
    patientName: 'John Doe',
    date: '2024-04-15',
    status: 'Draft',
  },
  {
    id: 2,
    type: 'Prescription',
    patientName: 'Jane Smith',
    date: '2024-04-16',
    status: 'Final',
  },
  {
    id: 3,
    type: 'Surgical Request',
    patientName: 'Robert Johnson',
    date: '2024-04-17',
    status: 'Pending',
  },
];

const Reports = () => {
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('');

  const handleGenerateReport = (type: string) => {
    // Implement report generation logic
    console.log(`Generating ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
        <div className="flex space-x-4">
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
          >
            <option value="all">All Report Types</option>
            <option value="Clinical Summary">Clinical Summary</option>
            <option value="Prescription">Prescription</option>
            <option value="Surgical Request">Surgical Request</option>
          </select>
          <input
            type="text"
            placeholder="Search patient..."
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => handleGenerateReport('Clinical Summary')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Clinical Summary</h3>
              <p className="text-sm text-gray-600">Generate insurance authorization report</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleGenerateReport('Prescription')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Prescription</h3>
              <p className="text-sm text-gray-600">Generate medication prescription</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => handleGenerateReport('Surgical Request')}
          className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <FileText className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-800">Surgical Request</h3>
              <p className="text-sm text-gray-600">Generate surgical authorization request</p>
            </div>
          </div>
        </button>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Report Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockReports.map((report) => (
              <tr key={report.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{report.type}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{report.patientName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{report.date}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      report.status === 'Final'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'Draft'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4">
                    <Edit2 className="w-5 h-5 inline-block" />
                  </button>
                  <button className="text-green-600 hover:text-green-900">
                    <Download className="w-5 h-5 inline-block" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports; 