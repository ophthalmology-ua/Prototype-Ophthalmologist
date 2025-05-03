import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  Clock, 
  Activity, 
  FileText, 
  Eye, 
  AlertCircle,
  ChevronRight,
  Plus,
  TrendingUp,
  Upload
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

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

interface ChartData {
  date: string;
  value: number;
}

interface ChartContainerProps {
  title: string;
  data: ChartData[];
  color: string;
  isVisualAcuity?: boolean;
}

// Mock data - replace with actual API calls in production
const mockPatient = {
  id: 'P001',
  name: 'Juan Pérez',
  age: 65,
  gender: 'Masculino',
  contactNumber: '+54 9 11 1234-5678',
  email: 'juan.perez@email.com',
  obraSocial: 'OSDE 410',
  diagnosis: 'Degeneración macular relacionada con la edad',
  primaryPhysician: 'Dra. María González',
  lastVisit: '2024-03-15',
  nextAppointment: '2024-04-15',
  status: 'Activo',
  treatmentPlan: {
    currentPhase: 'Mantenimiento',
    medication: 'Aflibercept',
    frequency: 'Cada 8 semanas',
    nextStep: 'Examen de seguimiento',
    nextStepDue: '2024-04-15',
    nextStepScheduled: true
  }
};

const mockTreatmentHistory: Treatment[] = [
  {
    date: '2024-03-15',
    type: 'Inyección intravítrea',
    notes: 'Aflibercept administrado en ojo derecho',
    outcome: 'Procedimiento realizado con éxito',
    nextStepScheduled: true
  },
  {
    date: '2024-02-01',
    type: 'Examen OCT',
    notes: 'Espesor macular estable',
    outcome: 'Sin cambios significativos observados',
    nextStepScheduled: true
  },
  {
    date: '2024-01-15',
    type: 'Inyección intravítrea',
    notes: 'Aflibercept administrado en ojo derecho',
    outcome: 'Procedimiento realizado con éxito',
    nextStepScheduled: true
  }
];

const mockAppointments: Appointment[] = [
  {
    id: 'A001',
    date: '2024-04-15',
    time: '10:30',
    type: 'Examen de seguimiento',
    status: 'scheduled'
  },
  {
    id: 'A002',
    date: '2024-03-15',
    time: '11:00',
    type: 'Inyección intravítrea',
    status: 'completed'
  },
  {
    id: 'A003',
    date: '2024-02-01',
    time: '09:15',
    type: 'Examen OCT',
    status: 'completed'
  }
];

// Mock progression data
const mockProgressionData = {
  macularThickness: [
    { date: '2023-10-15', value: 320 },
    { date: '2023-11-15', value: 310 },
    { date: '2023-12-15', value: 305 },
    { date: '2024-01-15', value: 295 },
    { date: '2024-02-15', value: 290 },
    { date: '2024-03-15', value: 285 },
  ],
  visualAcuity: [
    { date: '2023-10-15', value: 0.5 },  // 20/40
    { date: '2023-11-15', value: 0.6 },  // 20/33
    { date: '2023-12-15', value: 0.7 },  // 20/29
    { date: '2024-01-15', value: 0.8 },  // 20/25
    { date: '2024-02-15', value: 0.8 },  // 20/25
    { date: '2024-03-15', value: 0.9 },  // 20/22
  ]
};

// Calculate averages
const getAverage = (data: { value: number }[]) => {
  const sum = data.reduce((acc, curr) => acc + curr.value, 0);
  return (sum / data.length).toFixed(2);
};

// Datos de ejemplo para gráficos adicionales
const mockStudiesByMonth = [
  { mes: 'Ene', estudios: 2 },
  { mes: 'Feb', estudios: 3 },
  { mes: 'Mar', estudios: 1 },
  { mes: 'Abr', estudios: 4 },
  { mes: 'May', estudios: 2 },
  { mes: 'Jun', estudios: 3 },
];
const mockDiagnosisDistribution = [
  { name: 'DMAE', value: 6 },
  { name: 'Retinopatía diabética', value: 2 },
  { name: 'Otras', value: 1 },
];
const COLORS = ['#007BFF', '#28A745', '#FFBB28'];

// MOCKS para selector de diagnóstico y datos por diagnóstico
const mockDiagnoses = [
  { id: 'dmae', name: 'DMAE' },
  { id: 'rd', name: 'Retinopatía diabética' },
  { id: 'otras', name: 'Otras' }
];

interface ProgressionData {
  macularThickness: { date: string; value: number }[];
  visualAcuity: { date: string; value: number }[];
}

const mockProgressionDataByDiagnosis: Record<string, ProgressionData> = {
  dmae: mockProgressionData,
  rd: {
    macularThickness: [
      { date: '2023-10-15', value: 350 },
      { date: '2023-11-15', value: 340 },
      { date: '2023-12-15', value: 330 },
      { date: '2024-01-15', value: 320 },
      { date: '2024-02-15', value: 310 },
      { date: '2024-03-15', value: 305 },
    ],
    visualAcuity: [
      { date: '2023-10-15', value: 0.4 },
      { date: '2023-11-15', value: 0.5 },
      { date: '2023-12-15', value: 0.6 },
      { date: '2024-01-15', value: 0.7 },
      { date: '2024-02-15', value: 0.7 },
      { date: '2024-03-15', value: 0.8 },
    ]
  },
  otras: {
    macularThickness: [
      { date: '2023-10-15', value: 300 },
      { date: '2023-11-15', value: 295 },
      { date: '2023-12-15', value: 290 },
      { date: '2024-01-15', value: 285 },
      { date: '2024-02-15', value: 280 },
      { date: '2024-03-15', value: 275 },
    ],
    visualAcuity: [
      { date: '2023-10-15', value: 0.6 },
      { date: '2023-11-15', value: 0.7 },
      { date: '2023-12-15', value: 0.8 },
      { date: '2024-01-15', value: 0.8 },
      { date: '2024-02-15', value: 0.9 },
      { date: '2024-03-15', value: 1.0 },
    ]
  }
};

const PatientProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const { t, language } = useLanguage();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('dmae');

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const CustomTooltip = ({ active, payload, label, isVisualAcuity = false }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">{formatDate(label)}</p>
          <p className="text-sm font-medium text-gray-900">
            {isVisualAcuity ? (
              <>
                {(value * 100).toFixed(0)}% ({t('snellen')}{Math.round(20/value)})
              </>
            ) : (
              <>
                {value} {t('microns')}
              </>
            )}
          </p>
        </div>
      );
    }
    return null;
  };

  const getStatusColor = (status: string): string => {
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

  const ChartContainer = ({ title, data, color, isVisualAcuity = false }: ChartContainerProps) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className={`px-4 py-2 ${color === '#007BFF' ? 'bg-blue-50' : 'bg-green-50'} rounded-full`}>
          <span className={`text-sm ${color === '#007BFF' ? 'text-blue-700' : 'text-green-700'}`}>
            {t('average')}: {getAverage(data)}
            {isVisualAcuity ? '' : ` ${t('microns')}`}
          </span>
        </div>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              domain={isVisualAcuity ? [0, 1] : ['auto', 'auto']}
              tickFormatter={value => isVisualAcuity ? `${(value * 100)}%` : `${value}`}
              stroke="#9CA3AF"
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} isVisualAcuity={isVisualAcuity} />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 w-full">
            <div className="flex flex-row items-center gap-4 flex-1 min-w-0">
              <div className="h-16 w-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl font-bold">{mockPatient.name}</h1>
                <p className="text-blue-100">ID: {mockPatient.id} • {mockPatient.age} {t('years')} • {mockPatient.gender}</p>
                <p className="text-blue-100 mt-1">Obra social: <span className="font-semibold text-white">{mockPatient.obraSocial}</span></p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:items-center md:justify-end mt-4 md:mt-0">
              <button className="flex-1 min-w-[180px] h-24 flex flex-col items-center justify-center px-6 py-3 bg-white text-[#2563eb] rounded-xl font-bold shadow-lg hover:bg-[#e0e7ff] transition-colors text-lg">
                <Plus className="w-6 h-6 mb-1" />
                <span>Nueva cita</span>
              </button>
              <button
                className="flex-1 min-w-[180px] h-24 flex flex-col items-center justify-center px-6 py-3 bg-white text-[#2563eb] rounded-xl font-bold shadow-lg hover:bg-[#e0e7ff] transition-colors text-lg"
                onClick={() => navigate(`/upload?patientId=${id}`)}
              >
                <Upload className="w-6 h-6 mb-1" />
                <span>Subir estudio</span>
              </button>
            </div>
          </div>
          <div className="w-full mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              {/* Tarjeta de próximo turno */}
              <div className="bg-white bg-opacity-10 rounded-lg p-4 flex items-center min-h-[110px]">
                <Calendar className="w-5 h-5 mr-3" />
                <div className="min-w-0">
                  <p className="text-sm text-blue-100 truncate font-semibold">Siguiente turno</p>
                  {mockAppointments && mockAppointments.length > 0 ? (
                    <>
                      <p className="font-medium truncate">{mockAppointments[0].date} {mockAppointments[0].time}</p>
                      <p className="text-sm text-blue-100 truncate">Tipo: {mockAppointments[0].type}</p>
                    </>
                  ) : (
                    <p className="font-medium truncate">{t('notScheduled')}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-2 sm:px-6 min-w-max" aria-label="Tabs">
              {[
                { id: 'overview', label: 'Resumen', icon: Eye },
                { id: 'diagnosis', label: 'Diagnósticos', icon: Activity },
                { id: 'progression', label: 'Seguimiento', icon: TrendingUp },
                { id: 'history', label: 'Historial', icon: FileText },
                { id: 'appointments', label: 'Citas', icon: Calendar },
                { id: 'studies', label: 'Estudios', icon: FileText },
                { id: 'pending', label: 'Pendiente', icon: AlertCircle }
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
                    <h3 className="text-lg font-semibold text-gray-900">{t('patientInfo')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('contactNumber')}</p>
                        <p className="font-medium">{mockPatient.contactNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('email')}</p>
                        <p className="font-medium">{mockPatient.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('primaryPhysician')}</p>
                        <p className="font-medium">{mockPatient.primaryPhysician}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('lastVisit')}</p>
                        <p className="font-medium">{mockPatient.lastVisit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Current Treatment Plan */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">{t('currentTreatmentPlan')}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">{t('currentMedication')}</p>
                        <p className="font-medium">{mockPatient.treatmentPlan.medication}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t('frequency')}</p>
                        <p className="font-medium">{mockPatient.treatmentPlan.frequency}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500">{t('nextStep')}</p>
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

            {activeTab === 'diagnosis' && (
              <div className="space-y-4">
                {/* Lista de diagnósticos y profesional */}
                <div className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-blue-50 transition" onClick={() => navigate(`/diagnosis/${mockPatient.id}`)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{mockPatient.diagnosis}</h4>
                      <p className="text-sm text-gray-500">Profesional: {mockPatient.primaryPhysician}</p>
                    </div>
                    <span className="text-blue-600 font-medium">Ver detalle</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progression' && (
              <div className="space-y-6">
                {/* Selector de condición (diagnóstico) como grupo de botones */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4">
                  <div className="flex space-x-2">
                    {mockDiagnoses.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDiagnosis(d.id)}
                        className={`px-4 py-2 text-sm rounded-md transition-colors font-medium ${selectedDiagnosis === d.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {d.name}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Gráficos apilados en mobile, lado a lado en desktop */}
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1 w-full">
                    <ChartContainer 
                      title={t('macularThickness')}
                      data={mockProgressionDataByDiagnosis[selectedDiagnosis]?.macularThickness || []}
                      color="#007BFF"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <ChartContainer 
                      title={t('visualAcuity')}
                      data={mockProgressionDataByDiagnosis[selectedDiagnosis]?.visualAcuity || []}
                      color="#28A745"
                      isVisualAcuity
                    />
                  </div>
                </div>
                {/* Gráfico de barras: estudios por mes */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudios realizados por mes</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockStudiesByMonth}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mes" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Bar dataKey="estudios" fill="#007BFF" radius={[8,8,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                {/* Gráfico de pastel: distribución de diagnósticos */}
                <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100 w-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de diagnósticos</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockDiagnosisDistribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {mockDiagnosisDistribution.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
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

            {activeTab === 'studies' && (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Estudios recientes</h3>
                  <ul className="divide-y divide-gray-100">
                    <li className="py-2 flex justify-between items-center cursor-pointer hover:bg-blue-50 rounded transition">
                      <span>OCT</span>
                      <span className="text-gray-500 text-sm">2024-02-01</span>
                    </li>
                    <li className="py-2 flex justify-between items-center cursor-pointer hover:bg-blue-50 rounded transition">
                      <span>Angiografía</span>
                      <span className="text-gray-500 text-sm">2024-01-10</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-800">Acciones pendientes</p>
                    <ul className="list-disc ml-5 text-yellow-900">
                      <li>Sacar turno de control</li>
                      <li>Realizar estudio OCT</li>
                      <li>Actualizar datos de contacto</li>
                      {/* Aquí puedes agregar más acciones según la lógica real */}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile; 