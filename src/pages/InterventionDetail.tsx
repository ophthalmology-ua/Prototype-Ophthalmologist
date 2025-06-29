import { useParams, useNavigate } from 'react-router-dom';
import { Intervention } from '../components/InterventionUpload';
import React from 'react';

// Mock interventions (copy from PatientProfile for now)
const mockInterventions: Intervention[] = [
  {
    id: '1',
    type: 'injection',
    subtype: 'Inyección intravítrea anti-VEGF',
    date: '2024-03-15',
    time: '10:30',
    eye: 'OD',
    medication: 'Aflibercept',
    dosage: '2mg/0.05ml',
    surgeon: 'Dr. Injection',
    assistantSurgeon: 'Dra. Ayudante',
    anesthesiologist: 'Dr. Anestesista',
    instrumentator: 'Lic. Instrumentador',
    anesthesiaType: 'Tópica',
    notes: 'Procedimiento realizado sin complicaciones. Paciente toleró bien la inyección.',
    outcome: 'Procedimiento exitoso. Sin reacciones adversas inmediatas.',
    complications: '',
    nextFollowUp: '2024-05-15',
    files: [],
    isCompleted: true
  },
  {
    id: '2',
    type: 'surgery',
    subtype: 'Vitrectomía',
    date: '2024-01-20',
    time: '08:00',
    eye: 'OI',
    surgeon: 'Dr. Carlos Mendoza',
    assistantSurgeon: 'Dra. Ana López',
    anesthesiologist: 'Dr. Pablo Ruiz',
    instrumentator: 'Lic. Marta Gómez',
    anesthesiaType: 'General',
    notes: 'Vitrectomía pars plana para tratamiento de membrana epirretiniana. Procedimiento estándar.',
    outcome: 'Cirugía exitosa. Membrana removida completamente. Recuperación visual esperada.',
    complications: '',
    nextFollowUp: '2024-02-20',
    files: [],
    isCompleted: true
  },
  {
    id: '3',
    type: 'laser',
    subtype: 'Láser YAG',
    date: '2024-02-10',
    time: '09:00',
    eye: 'OD',
    laserType: 'YAG',
    surgeon: 'Dr. Laser',
    assistantSurgeon: 'Dra. Luz',
    anesthesiologist: 'Dr. Anestesista',
    instrumentator: 'Lic. Instrumentador',
    anesthesiaType: 'Tópica',
    notes: 'Capsulotomía posterior con láser YAG. Procedimiento sin complicaciones.',
    outcome: 'Mejoría en la agudeza visual. Sin complicaciones.',
    complications: '',
    nextFollowUp: '2024-03-10',
    files: [],
    isCompleted: true
  },
  {
    id: '4',
    type: 'other',
    subtype: 'Procedimiento especial',
    date: '2024-04-01',
    time: '14:00',
    eye: 'Both',
    surgeon: 'Dr. Especialista',
    assistantSurgeon: 'Dra. Ayudante Especial',
    anesthesiologist: 'Dr. Anestesista Especial',
    instrumentator: 'Lic. Instrumentador Especial',
    anesthesiaType: 'Sedación',
    notes: 'Procedimiento especial realizado bajo sedación.',
    outcome: 'Sin complicaciones.',
    complications: '',
    nextFollowUp: '2024-05-01',
    files: [],
    isCompleted: true
  }
];

const InterventionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const intervention = mockInterventions.find(i => i.id === id);

  if (!intervention) {
    return <div className="p-8">Intervención no encontrada.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={() => navigate(-1)}
      >
        Volver
      </button>
      <div className="bg-white rounded-xl shadow p-6 border space-y-4">
        <h2 className="text-2xl font-bold mb-2">{intervention.subtype}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><span className="font-semibold">Tipo:</span> {intervention.type}</div>
          <div><span className="font-semibold">Fecha:</span> {intervention.date}</div>
          <div><span className="font-semibold">Hora:</span> {intervention.time}</div>
          <div><span className="font-semibold">Ojo:</span> {intervention.eye}</div>
          {intervention.medication && <div><span className="font-semibold">Medicación:</span> {intervention.medication}</div>}
          {intervention.dosage && <div><span className="font-semibold">Dosis:</span> {intervention.dosage}</div>}
          {intervention.laserType && <div><span className="font-semibold">Tipo de láser:</span> {intervention.laserType}</div>}
          {intervention.surgeon && <div><span className="font-semibold">Cirujano:</span> {intervention.surgeon}</div>}
          {intervention.assistantSurgeon && <div><span className="font-semibold">Cirujano asistente:</span> {intervention.assistantSurgeon}</div>}
          {intervention.anesthesiologist && <div><span className="font-semibold">Anestesiólogo:</span> {intervention.anesthesiologist}</div>}
          {intervention.instrumentator && <div><span className="font-semibold">Instrumentador/a:</span> {intervention.instrumentator}</div>}
          {intervention.anesthesiaType && <div><span className="font-semibold">Tipo de anestesia:</span> {intervention.anesthesiaType}</div>}
          {intervention.nextFollowUp && <div><span className="font-semibold">Próximo seguimiento:</span> {intervention.nextFollowUp}</div>}
        </div>
        <div>
          <span className="font-semibold">Notas:</span>
          <div className="bg-gray-50 rounded p-2 mt-1">{intervention.notes}</div>
        </div>
        <div>
          <span className="font-semibold">Resultado:</span>
          <div className="bg-gray-50 rounded p-2 mt-1">{intervention.outcome}</div>
        </div>
        {intervention.complications && (
          <div>
            <span className="font-semibold">Complicaciones:</span>
            <div className="bg-red-50 rounded p-2 mt-1">{intervention.complications}</div>
          </div>
        )}
        {intervention.files && intervention.files.length > 0 && (
          <div>
            <span className="font-semibold">Archivos adjuntos:</span>
            <ul className="list-disc ml-6 mt-1">
              {intervention.files.map((file, idx) => (
                <li key={idx}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <div>
          <span className="font-semibold">Estado:</span> {intervention.isCompleted ? 'Completado' : 'Pendiente'}
        </div>
      </div>
    </div>
  );
};

export default InterventionDetail; 