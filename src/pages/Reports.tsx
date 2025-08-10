import { useState } from 'react';
import { FileText, Download, Edit2, ClipboardList, Stethoscope } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Reports = () => {
  const { t } = useLanguage();

  // Mock reports data
  const mockReports = [
    {
      id: 1,
      type: t('clinicalSummary'),
      patientName: 'John Doe',
      date: '2024-04-15',
      status: t('draft'),
    },
    {
      id: 2,
      type: t('prescription'),
      patientName: 'Jane Smith',
      date: '2024-04-16',
      status: t('final'),
    },
    {
      id: 3,
      type: t('surgicalRequest'),
      patientName: 'Robert Johnson',
      date: '2024-04-17',
      status: t('pending'),
    },
  ];
  const [selectedReportType, setSelectedReportType] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState('');

  const handleGenerateReport = (type: string) => {
    // Implement report generation logic
    console.log(`Generating ${type} report...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">{t('reports')}</h1>
        <div className="flex space-x-4">
          <select
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedReportType}
            onChange={(e) => setSelectedReportType(e.target.value)}
          >
            <option value="all">{t('allReportTypes')}</option>
            <option value={t('clinicalSummary')}>{t('clinicalSummary')}</option>
            <option value={t('prescription')}>{t('prescription')}</option>
            <option value={t('surgicalRequest')}>{t('surgicalRequest')}</option>
          </select>
          <input
            type="text"
            placeholder={t('searchPatient')}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('clinicalSummary')}</h3>
                <p className="text-sm text-gray-600">{t('clinicalSummaryDesc')}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
            <button
              onClick={() => handleGenerateReport('Clinical Summary')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('generateReport')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('prescription')}</h3>
                <p className="text-sm text-gray-600">{t('prescriptionDesc')}</p>
              </div>
              <ClipboardList className="w-8 h-8 text-blue-500" />
            </div>
            <button
              onClick={() => handleGenerateReport('Prescription')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('generatePrescription')}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{t('surgicalRequest')}</h3>
                <p className="text-sm text-gray-600">{t('surgicalRequestDesc')}</p>
              </div>
              <Stethoscope className="w-8 h-8 text-blue-500" />
            </div>
            <button
              onClick={() => handleGenerateReport('Surgical Request')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('generateRequest')}
            </button>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('reportType')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('patient')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('date')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('status')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('actions')}
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
                      report.status === t('final')
                        ? 'bg-green-100 text-green-800'
                        : report.status === t('draft')
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-4" title={t('edit')}>
                    <Edit2 className="w-5 h-5 inline-block" />
                  </button>
                  <button className="text-green-600 hover:text-green-900" title={t('download')}>
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