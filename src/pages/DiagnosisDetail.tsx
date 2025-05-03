import { useNavigate } from 'react-router-dom';
import { Calendar, AlertCircle, FileText, ArrowLeft, Clock, CheckCircle, Hourglass } from 'lucide-react';

// Simulación de datos (en una app real, esto vendría de una API o contexto)
const mockDiagnosis = {
  id: 'P001',
  diagnosis: 'Degeneración macular relacionada con la edad',
  professional: 'Dra. María González',
  studies: [
    { id: 'S001', name: 'OCT', date: '2024-02-01' },
    { id: 'S002', name: 'Angiografía', date: '2024-01-10' }
  ],
  treatment: {
    phase: 'Mantenimiento',
    medication: 'Aflibercept',
    frequency: 'Cada 8 semanas',
    nextStep: 'Examen de seguimiento',
    nextStepDue: '2024-04-15',
    nextStepScheduled: true
  },
  appointments: [
    { id: 'A001', date: '2024-04-15', time: '10:30', type: 'Examen de seguimiento', status: 'futuro' },
    { id: 'A002', date: '2024-03-15', time: '11:00', type: 'Inyección intravítrea', status: 'previo' }
  ],
  previousSteps: [
    { id: 'P1', desc: 'Diagnóstico inicial', date: '2024-01-01' },
    { id: 'P2', desc: 'Primer OCT', date: '2024-01-10' }
  ],
  futureSteps: [
    { id: 'F1', desc: 'Control visual', date: '2024-05-10' }
  ],
  pending: [
    { id: 'PE1', desc: 'Realizar estudio de campo visual' }
  ]
};

export default function DiagnosisDetail() {
  const navigate = useNavigate();

  // En una app real, buscarías el diagnóstico por id
  const diagnosis = mockDiagnosis;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <button className="flex items-center mb-6 text-blue-600 hover:underline" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5 mr-2" /> Volver
      </button>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{diagnosis.diagnosis}</h1>
        <p className="text-gray-600 mb-2">Profesional: <span className="font-medium">{diagnosis.professional}</span></p>
        <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-600" /> Estudios pertinentes</h2>
        <ul className="mb-4">
          {diagnosis.studies.map(study => (
            <li key={study.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <span>{study.name}</span>
              <span className="text-gray-500 text-sm">{study.date}</span>
            </li>
          ))}
        </ul>
        <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-blue-600" /> Tratamiento asociado</h2>
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <p className="mb-1"><span className="font-medium">Fase:</span> {diagnosis.treatment.phase}</p>
          <p className="mb-1"><span className="font-medium">Medicación:</span> {diagnosis.treatment.medication}</p>
          <p className="mb-1"><span className="font-medium">Frecuencia:</span> {diagnosis.treatment.frequency}</p>
          <p className="mb-1"><span className="font-medium">Próximo paso:</span> {diagnosis.treatment.nextStep}</p>
          <p className="mb-1"><span className="font-medium">Fecha del próximo paso:</span> {diagnosis.treatment.nextStepDue}</p>
        </div>
        {/* Turnos */}
        <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center"><Calendar className="w-5 h-5 mr-2 text-blue-600" /> Turnos</h2>
        <ul className="mb-4">
          {diagnosis.appointments.map(app => (
            <li key={app.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <span className="flex items-center gap-2">
                {app.status === 'previo' && <CheckCircle className="w-4 h-4 text-green-500" />} 
                {app.status === 'futuro' && <Clock className="w-4 h-4 text-blue-500" />} 
                {app.type}
              </span>
              <span className="text-gray-500 text-sm">{app.date} {app.time}</span>
            </li>
          ))}
        </ul>
        {/* Pasos previos */}
        <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center"><CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Pasos previos</h2>
        <ul className="mb-4">
          {diagnosis.previousSteps.map(step => (
            <li key={step.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <span>{step.desc}</span>
              <span className="text-gray-500 text-sm">{step.date}</span>
            </li>
          ))}
        </ul>
        {/* Pasos futuros */}
        <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center"><Hourglass className="w-5 h-5 mr-2 text-yellow-600" /> Pasos futuros</h2>
        <ul className="mb-4">
          {diagnosis.futureSteps.map(step => (
            <li key={step.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
              <span>{step.desc}</span>
              <span className="text-gray-500 text-sm">{step.date}</span>
            </li>
          ))}
        </ul>
        {/* Pendientes */}
        <h2 className="text-lg font-semibold mt-6 mb-2 flex items-center"><AlertCircle className="w-5 h-5 mr-2 text-red-600" /> Pendientes</h2>
        <ul>
          {diagnosis.pending.map(item => (
            <li key={item.id} className="flex items-center py-2 border-b last:border-b-0">
              <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
              <span>{item.desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 