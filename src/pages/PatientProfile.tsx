import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Activity, 
  FileText, 
  Eye, 
  AlertCircle,
  ChevronRight,
  Plus,
  TrendingUp,
  Upload,
  ClipboardList,
  Info,
  ChevronDown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend, TooltipProps } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';

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

interface MedicalHistory {
  title: string;
  items: { label: string; value: string }[];
}

// Mock data - replace with actual API calls in production
const mockPatient = {
  id: '32.456.789', // Argentinian DNI sample
  name: 'Juan Pérez',
  age: 65,
  gender: 'Masculino',
  contactNumber: '+54 9 11 1234-5678',
  email: 'juan.perez@email.com',
  obraSocial: 'OSDE 410',
  clinicalHistoryNumber: '001', // mock clinical history number
  affiliateNumber: 'OSDE-12345678', // mock affiliate number
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

const mockRecentStudies = [
  { id: '1', name: 'OCT', date: '2024-02-01', type: 'Estudio' },
  { id: '2', name: 'Consulta', date: '2024-06-02', type: 'Consulta' }
];

const mockMedicalHistory: {
  ophthalmological: MedicalHistory;
  personal: MedicalHistory;
  family: MedicalHistory;
} = {
  ophthalmological: {
    title: 'Antecedentes Oftalmológicos',
    items: [
      { label: 'DMAE', value: 'Sí, tipo húmeda (2023)' },
      { label: 'Glaucoma', value: 'No' },
      { label: 'Cataratas', value: 'Sí, operado (2020)' },
      { label: 'Retinopatía Diabética', value: 'No' },
      { label: 'Miopía', value: 'Sí, -3.50' },
      { label: 'Hipertensión Ocular', value: 'No' },
      { label: 'Ojo Seco', value: 'Sí, leve' },
      { label: 'Desprendimiento de Retina', value: 'No' }
    ]
  },
  personal: {
    title: 'Antecedentes Personales',
    items: [
      { label: 'Hipertensión Arterial', value: 'Sí, controlada' },
      { label: 'Diabetes', value: 'No' },
      { label: 'Tabaquismo', value: 'Ex fumador (20 años)' },
      { label: 'Alergias', value: 'Ninguna conocida' },
      { label: 'Medicación Actual', value: 'Enalapril 20mg, Atorvastatina 40mg' }
    ]
  },
  family: {
    title: 'Antecedentes Familiares',
    items: [
      { label: 'DMAE en Familia', value: 'Madre (diagnosticada a los 70 años)' },
      { label: 'Glaucoma', value: 'Hermano mayor' },
      { label: 'Diabetes', value: 'Padre (tipo 2)' },
      { label: 'Hipertensión', value: 'Ambos padres' }
    ]
  }
};

// Mock consultations data
const mockConsultations = [
  {
    id: 'C001',
    date: '2024-03-15',
    motivoConsulta: 'Control de DMAE',
    antecedentesEnfActual: 'Paciente con antecedentes de DMAE húmeda.',
    antecedentesPatologicos: 'Hipertensión arterial',
    medicacionHabitual: 'Enalapril',
    alergias: 'Ninguna',
    antecedentesQuirurgicos: 'Cirugía de cataratas',
    antecedentesHeredo: 'Madre con DMAE',
    antecedentesOftalmo: 'Miopía',
    datosAccesorios: 'N/A',
    examenOftalmo: {
      agudezaVisualLejos: { od: '20/40', oi: '20/30' },
      agudezaVisualCerca: { od: 'J2', oi: 'J1' },
      presionIntraocular: { od: '15', oi: '16' },
      fondoOjos: 'Sin alteraciones',
      otrosEstudios: 'OCT normal',
    },
    notasExtra: 'Sin novedades',
    diagnosticoPresuntivo: 'DMAE húmeda',
    planEstudios: 'OCT en 3 meses',
    planTerapeutico: 'Aflibercept 2mg',
    proximoControl: '2024-06-15',
  },
  {
    id: 'C002',
    date: '2023-12-10',
    motivoConsulta: 'Chequeo general',
    antecedentesEnfActual: 'Sin antecedentes relevantes.',
    antecedentesPatologicos: 'Ninguno',
    medicacionHabitual: 'Ninguna',
    alergias: 'Penicilina',
    antecedentesQuirurgicos: 'Ninguno',
    antecedentesHeredo: 'Padre con diabetes',
    antecedentesOftalmo: 'Hipertensión ocular',
    datosAccesorios: 'N/A',
    examenOftalmo: {
      agudezaVisualLejos: { od: '20/25', oi: '20/25' },
      agudezaVisualCerca: { od: 'J1', oi: 'J1' },
      presionIntraocular: { od: '14', oi: '15' },
      fondoOjos: 'Leve alteración vascular',
      otrosEstudios: 'Campimetría normal',
    },
    notasExtra: 'Control anual',
    diagnosticoPresuntivo: 'Normal',
    planEstudios: 'Control en 1 año',
    planTerapeutico: 'Ninguno',
    proximoControl: '2024-12-10',
  },
];

// Type for a consultation object
type ConsultationType = {
  id: string;
  date: string;
  motivoConsulta: string;
  antecedentesEnfActual: string;
  antecedentesPatologicos: string;
  medicacionHabitual: string;
  alergias: string;
  antecedentesQuirurgicos: string;
  antecedentesHeredo: string;
  antecedentesOftalmo: string;
  datosAccesorios: string;
  examenOftalmo: {
    agudezaVisualLejos: { od: string; oi: string };
    agudezaVisualCerca: { od: string; oi: string };
    presionIntraocular: { od: string; oi: string };
    fondoOjos: string;
    otrosEstudios: string;
  };
  notasExtra: string;
  diagnosticoPresuntivo: string;
  planEstudios: string;
  planTerapeutico: string;
  proximoControl: string;
};

// Add Study type
interface Study {
  id: number;
  type: string;
  file: File | null;
  fields: Record<string, string>;
}

function SubirTab() {
  // Patient data
  const [patientData, setPatientData] = useState({
    name: '',
    dni: '',
    age: '',
    obraSocial: '',
    affiliateNumber: '',
  });
  // Motivo de consulta y antecedentes
  const [motivoConsulta, setMotivoConsulta] = useState('');
  const [antecedentesEnfActual, setAntecedentesEnfActual] = useState('');
  const [primeraVezOpen, setPrimeraVezOpen] = useState(false);
  const [antecedentesPatologicos, setAntecedentesPatologicos] = useState('');
  const [medicacionHabitual, setMedicacionHabitual] = useState('');
  const [alergias, setAlergias] = useState('');
  const [antecedentesQuirurgicos, setAntecedentesQuirurgicos] = useState('');
  const [antecedentesHeredo, setAntecedentesHeredo] = useState('');
  const [antecedentesOftalmo, setAntecedentesOftalmo] = useState('');
  const [datosAccesorios, setDatosAccesorios] = useState('');
  // Estudios
  const [studies, setStudies] = useState<Study[]>([]);
  // Notas extra, diagnóstico, plan, próximo control
  const [notasExtra, setNotasExtra] = useState('');
  const [planEstudios, setPlanEstudios] = useState('');
  // Treatment plan type and state
  interface TreatmentPlan {
    type: string;
    noFarm: string;
    via: string;
    farmaco: string;
    cantidad: string;
    unidad: string;
    farmacoOtro: string;
  }
  const [treatmentPlanInput, setTreatmentPlanInput] = useState<TreatmentPlan>({
    type: '',
    noFarm: '',
    via: '',
    farmaco: '',
    cantidad: '',
    unidad: '',
    farmacoOtro: '',
  });
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [editTreatmentIdx, setEditTreatmentIdx] = useState<number | null>(null);
  const [proximoControl, setProximoControl] = useState('');
  // UploadStudy modal state
  const [studyType, setStudyType] = useState('oct'); // NEW: study type state
  const [octFields, setOctFields] = useState({
    centralThickness: '',
    retinalVolume: '',
    averageThickness: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // NEW: Retinografía fields
  const [retinoFields, setRetinoFields] = useState({
    findings: '',
    imageQuality: ''
  });
  // NEW: Campimetría fields
  const [campiFields, setCampiFields] = useState({
    md: '',
    psd: '',
    vfi: ''
  });
  // Collapsible states for ophthalmologic exam
  const [isToleradaOpen, setIsToleradaOpen] = useState(false);
  const [isPrescripcionOpen, setIsPrescripcionOpen] = useState(false);
  const [isMasDetalleVisionOpen, setIsMasDetalleVisionOpen] = useState(false);
  const [isPosicionOcularOpen, setIsPosicionOcularOpen] = useState(false);
  const [isBiomicroscopiaOpen, setIsBiomicroscopiaOpen] = useState(false);
  // Collapsible state for patient data
  const [isDatosPacienteOpen, setIsDatosPacienteOpen] = useState(false);
  // Add state for angiografia fields
  const [angioFields, setAngioFields] = useState({
    fovealAvascularZone: '',
    leakage: '',
    nonPerfusedAreas: '',
    microaneurysms: '',
    neovascularization: '',
    capillaryDropout: '',
    arteriovenousShunt: '',
    venousBeading: '',
    macularEdema: '',
    hardExudates: '',
    cottonWoolSpots: '',
    hemorrhages: '',
    vesselTortuosity: '',
    choroidalNeovascularization: '',
    centralRetinalThickness: '',
    comments: '',
  });
  // New state for detecting values
  const [isDetecting, setIsDetecting] = useState(false);
  // Add Diagnóstico type and state
  const DIAGNOSIS_OPTIONS = [
    'DMAE',
    'Retinopatía diabética',
    'Glaucoma',
    'Cataratas',
    'Otras'
  ];
  interface Diagnosis {
    diagnosis: string;
    status: 'Presuntivo' | 'Confirmado';
  }
  const [diagnosisInput, setDiagnosisInput] = useState(DIAGNOSIS_OPTIONS[0]);
  const [diagnosisStatus, setDiagnosisStatus] = useState<'Presuntivo' | 'Confirmado'>('Presuntivo');
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [editStudyIdx, setEditStudyIdx] = useState<number | null>(null);

  const handleAddDiagnosis = () => {
    setDiagnoses(prev => [...prev, { diagnosis: diagnosisInput, status: diagnosisStatus }]);
  };
  const handleRemoveDiagnosis = (idx: number) => {
    setDiagnoses(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveStudy = (idx: number) => {
    setStudies(prev => prev.filter((_, i) => i !== idx));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Add back handleAddStudy for adding multiple studies
  const handleAddStudy = () => {
    const studyData: Omit<Study, 'id'> = { type: studyType, file: selectedFile, fields: {} };
    if (studyType === 'oct') studyData.fields = { ...octFields };
    if (studyType === 'retinografia') studyData.fields = { ...retinoFields };
    if (studyType === 'campimetria') studyData.fields = { ...campiFields };
    if (studyType === 'angiografia') studyData.fields = { ...angioFields };
    setStudies(prev => [...prev, { id: Date.now(), ...studyData }]);
    setSelectedFile(null);
    setOctFields({ centralThickness: '', retinalVolume: '', averageThickness: '' });
    setRetinoFields({ findings: '', imageQuality: '' });
    setCampiFields({ md: '', psd: '', vfi: '' });
    setAngioFields({
      fovealAvascularZone: '',
      leakage: '',
      nonPerfusedAreas: '',
      microaneurysms: '',
      neovascularization: '',
      capillaryDropout: '',
      arteriovenousShunt: '',
      venousBeading: '',
      macularEdema: '',
      hardExudates: '',
      cottonWoolSpots: '',
      hemorrhages: '',
      vesselTortuosity: '',
      choroidalNeovascularization: '',
      centralRetinalThickness: '',
      comments: '',
    });
  };

  const handleEditStudy = (idx: number) => {
    const study = studies[idx];
    setEditStudyIdx(idx);
    setStudyType(study.type);
    setSelectedFile(study.file);
    if (study.type === 'oct') setOctFields(study.fields as typeof octFields);
    if (study.type === 'retinografia') setRetinoFields(study.fields as typeof retinoFields);
    if (study.type === 'campimetria') setCampiFields(study.fields as typeof campiFields);
    if (study.type === 'angiografia') setAngioFields(study.fields as typeof angioFields);
  };

  const handleSaveEditStudy = () => {
    const updatedStudies = [...studies];
    let updatedFields: Record<string, string> = {};
    if (studyType === 'oct') updatedFields = { ...octFields };
    if (studyType === 'retinografia') updatedFields = { ...retinoFields };
    if (studyType === 'campimetria') updatedFields = { ...campiFields };
    if (studyType === 'angiografia') updatedFields = { ...angioFields };
    updatedStudies[editStudyIdx!] = {
      id: updatedStudies[editStudyIdx!].id,
      type: studyType,
      file: selectedFile,
      fields: updatedFields,
    };
    setStudies(updatedStudies);
    setEditStudyIdx(null);
    setSelectedFile(null);
    setOctFields({ centralThickness: '', retinalVolume: '', averageThickness: '' });
    setRetinoFields({ findings: '', imageQuality: '' });
    setCampiFields({ md: '', psd: '', vfi: '' });
    setAngioFields({
      fovealAvascularZone: '',
      leakage: '',
      nonPerfusedAreas: '',
      microaneurysms: '',
      neovascularization: '',
      capillaryDropout: '',
      arteriovenousShunt: '',
      venousBeading: '',
      macularEdema: '',
      hardExudates: '',
      cottonWoolSpots: '',
      hemorrhages: '',
      vesselTortuosity: '',
      choroidalNeovascularization: '',
      centralRetinalThickness: '',
      comments: '',
    });
  };

  const handleCancelEditStudy = () => {
    setEditStudyIdx(null);
    setSelectedFile(null);
    setOctFields({ centralThickness: '', retinalVolume: '', averageThickness: '' });
    setRetinoFields({ findings: '', imageQuality: '' });
    setCampiFields({ md: '', psd: '', vfi: '' });
    setAngioFields({
      fovealAvascularZone: '',
      leakage: '',
      nonPerfusedAreas: '',
      microaneurysms: '',
      neovascularization: '',
      capillaryDropout: '',
      arteriovenousShunt: '',
      venousBeading: '',
      macularEdema: '',
      hardExudates: '',
      cottonWoolSpots: '',
      hemorrhages: '',
      vesselTortuosity: '',
      choroidalNeovascularization: '',
      centralRetinalThickness: '',
      comments: '',
    });
  };

  const handleAddTreatmentPlan = () => {
    setTreatmentPlans(prev => [...prev, { ...treatmentPlanInput }]);
    setTreatmentPlanInput({ type: '', noFarm: '', via: '', farmaco: '', cantidad: '', unidad: '', farmacoOtro: '' });
  };
  const handleEditTreatmentPlan = (idx: number) => {
    setEditTreatmentIdx(idx);
    setTreatmentPlanInput({ ...treatmentPlans[idx] });
  };
  const handleSaveEditTreatmentPlan = () => {
    const updated = [...treatmentPlans];
    updated[editTreatmentIdx!] = { ...treatmentPlanInput };
    setTreatmentPlans(updated);
    setEditTreatmentIdx(null);
    setTreatmentPlanInput({ type: '', noFarm: '', via: '', farmaco: '', cantidad: '', unidad: '', farmacoOtro: '' });
  };
  const handleCancelEditTreatmentPlan = () => {
    setEditTreatmentIdx(null);
    setTreatmentPlanInput({ type: '', noFarm: '', via: '', farmaco: '', cantidad: '', unidad: '', farmacoOtro: '' });
  };
  const handleRemoveTreatmentPlan = (idx: number) => {
    setTreatmentPlans(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <form className="space-y-8">
      {/* Datos del Paciente (collapsible) */}
      <div className="bg-white rounded-xl p-6 border">
        <button type="button" className="flex items-center font-bold text-lg mb-4" onClick={() => setIsDatosPacienteOpen(v => !v)}>
          {isDatosPacienteOpen ? <ChevronDown className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />}Datos del Paciente
        </button>
        {isDatosPacienteOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border rounded px-3 py-2" placeholder="Nombre completo" value={patientData.name} onChange={e => setPatientData(d => ({ ...d, name: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="DNI" value={patientData.dni} onChange={e => setPatientData(d => ({ ...d, dni: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Edad" value={patientData.age} onChange={e => setPatientData(d => ({ ...d, age: e.target.value }))} />
            <input className="border rounded px-3 py-2" placeholder="Obra Social / Nº de afiliado" value={patientData.obraSocial} onChange={e => setPatientData(d => ({ ...d, obraSocial: e.target.value }))} />
          </div>
        )}
      </div>
      {/* Motivo de Consulta */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Motivo de Consulta</h2>
        <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Describa el motivo de consulta" value={motivoConsulta} onChange={e => setMotivoConsulta(e.target.value)} />
      </div>
      {/* Antecedentes de la Enfermedad Actual */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Antecedentes de la Enfermedad Actual</h2>
        <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Describa los antecedentes de la enfermedad actual" value={antecedentesEnfActual} onChange={e => setAntecedentesEnfActual(e.target.value)} />
      </div>
      {/* Antecedentes (collapsible) */}
      <div className="bg-white rounded-xl p-6 border">
        <button type="button" className="flex items-center font-bold text-lg mb-4" onClick={() => setPrimeraVezOpen(v => !v)}>
          {primeraVezOpen ? <ChevronDown className="w-5 h-5 mr-2" /> : <ChevronRight className="w-5 h-5 mr-2" />}Antecedentes
        </button>
        {primeraVezOpen && (
          <div className="space-y-2">
            <textarea className="w-full border rounded px-3 py-2" placeholder="Antecedentes patológicos personales" value={antecedentesPatologicos} onChange={e => setAntecedentesPatologicos(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Medicación habitual" value={medicacionHabitual} onChange={e => setMedicacionHabitual(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Alergias" value={alergias} onChange={e => setAlergias(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Antecedentes quirúrgicos" value={antecedentesQuirurgicos} onChange={e => setAntecedentesQuirurgicos(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Antecedentes Heredo familiares" value={antecedentesHeredo} onChange={e => setAntecedentesHeredo(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Antecedentes oftalmológicos" value={antecedentesOftalmo} onChange={e => setAntecedentesOftalmo(e.target.value)} />
            <textarea className="w-full border rounded px-3 py-2" placeholder="Datos Accesorios Relevantes" value={datosAccesorios} onChange={e => setDatosAccesorios(e.target.value)} />
          </div>
        )}
      </div>
      {/* Examen Oftalmológico (expanded, with collapsibles) */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Examen Oftalmológico</h2>
        {/* Agudeza Visual */}
        <h3 className="font-semibold mb-2">1. Agudeza Visual - Lejos</h3>
        <div className="mb-2">a) Sin Corrección</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border rounded px-3 py-2" placeholder="OD" />
          <input className="border rounded px-3 py-2" placeholder="OI" />
        </div>
        <div className="mb-2">b) Con estenopeico</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border rounded px-3 py-2" placeholder="OD" />
          <input className="border rounded px-3 py-2" placeholder="OI" />
        </div>
        <div className="mb-2">c) Con la Mejor Corrección</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <input className="border rounded px-3 py-2" placeholder="OD" />
          <input className="border rounded px-3 py-2" placeholder="OI" />
        </div>
        <h3 className="font-semibold mb-2">Agudeza Visual - Cerca</h3>
        <div className="mb-2">Con corrección</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <input className="border rounded px-3 py-2" placeholder="OD" />
          <input className="border rounded px-3 py-2" placeholder="OI" />
        </div>
        <div className="mb-2">Sin corrección</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <input className="border rounded px-3 py-2" placeholder="OD" />
          <input className="border rounded px-3 py-2" placeholder="OI" />
        </div>
        {/* Refracción */}
        <h3 className="font-semibold mb-2">2. Refracción</h3>
        <div className="mb-2">A. Lejos</div>
        <div className="mb-2">a) Mejor Corrección</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
          <input className="border rounded px-3 py-2" placeholder="OD: Esférico +/- 00.00D; Cilíndrico +/- 00.00D x 000°" />
          <input className="border rounded px-3 py-2" placeholder="OI: Esférico +/- 00.00D; Cilíndrico +/- 00.00D x 000°" />
        </div>
        {/* Corrección Mejor Tolerada (collapsible) */}
        <button type="button" className="flex items-center font-semibold mb-2" onClick={() => setIsToleradaOpen(v => !v)}>
          {isToleradaOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}b) Corrección Mejor Tolerada
        </button>
        {isToleradaOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input className="border rounded px-3 py-2" placeholder="OD..." />
            <input className="border rounded px-3 py-2" placeholder="OI..." />
          </div>
        )}
        {/* Corrección para Prescripción (collapsible) */}
        <button type="button" className="flex items-center font-semibold mb-2" onClick={() => setIsPrescripcionOpen(v => !v)}>
          {isPrescripcionOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}c) Corrección para Prescripción
        </button>
        {isPrescripcionOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
            <input className="border rounded px-3 py-2" placeholder="OD..." />
            <input className="border rounded px-3 py-2" placeholder="OI..." />
          </div>
        )}
        <div className="mb-2">B. Cerca</div>
        <input className="border rounded px-3 py-2 mb-2" placeholder="Adición (Esférico +0.00D)" />
        <div className="mb-2">C. Intermedia</div>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" id="intermediaAuto" />
          <label htmlFor="intermediaAuto">Calcular automáticamente</label>
        </div>
        <input className="border rounded px-3 py-2 mb-2" placeholder="Adición intermedia (Esférico +0.00D)" />
        {/* Más detalle en visión (collapsible) */}
        <button type="button" className="flex items-center font-semibold mb-2" onClick={() => setIsMasDetalleVisionOpen(v => !v)}>
          {isMasDetalleVisionOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}3. Más detalle en visión
        </button>
        {isMasDetalleVisionOpen && (
          <div className="mb-4">
            <div className="mb-2">Visión de Colores</div>
            <select className="border rounded px-3 py-2 mb-2">
              <option>Seleccionar</option>
              <option>Normal</option>
              <option>Alterada</option>
            </select>
            <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Notas sobre visión de colores" />
            <div className="mb-2">Visión 3D</div>
            <select className="border rounded px-3 py-2 mb-2">
              <option>Seleccionar</option>
              <option>Normal</option>
              <option>Alterada</option>
            </select>
            <textarea className="w-full border rounded px-3 py-2 mb-4" placeholder="Notas sobre visión 3D" />
          </div>
        )}
        {/* Posición Ocular (collapsible) */}
        <button type="button" className="flex items-center font-semibold mb-2" onClick={() => setIsPosicionOcularOpen(v => !v)}>
          {isPosicionOcularOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}4. Posición Ocular
        </button>
        {isPosicionOcularOpen && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <input type="checkbox" className="mr-2" id="ortotropia" />
              <label htmlFor="ortotropia">Ortotropia</label>
            </div>
            <textarea className="w-full border rounded px-3 py-2 mb-4" placeholder="Más detalle en posición ocular" />
          </div>
        )}
        {/* Biomicroscopía (collapsible) */}
        <button type="button" className="flex items-center font-semibold mb-2" onClick={() => setIsBiomicroscopiaOpen(v => !v)}>
          {isBiomicroscopiaOpen ? <ChevronDown className="w-4 h-4 mr-1" /> : <ChevronRight className="w-4 h-4 mr-1" />}5. Biomicroscopía
        </button>
        {isBiomicroscopiaOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
            <textarea className="border rounded px-3 py-2" placeholder="OD" />
            <textarea className="border rounded px-3 py-2" placeholder="OI" />
            <textarea className="border rounded px-3 py-2" placeholder="AO" />
          </div>
        )}
        {/* Presión Intraocular */}
        <div className="font-semibold mb-2">6. Presión Intraocular</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
          <input className="border rounded px-3 py-2" placeholder="OD (mmHg)" />
          <input className="border rounded px-3 py-2" placeholder="OI (mmHg)" />
        </div>
        {/* Fondo de ojos */}
        <div className="font-semibold mb-2">7. Fondo de ojos</div>
        <div className="flex items-center mb-2">
          <input type="checkbox" className="mr-2" id="fondoOjos" />
          <label htmlFor="fondoOjos">OBI</label>
        </div>
        <textarea className="w-full border rounded px-3 py-2 mb-4" placeholder="Descripción del fondo de ojos" />
        {/* Otros estudios */}
        <div className="font-semibold mb-2">8. Otros estudios</div>
        <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Describa otros estudios realizados" />
      </div>
      {/* Estudios (add study container with + button) */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Subida de estudios</h2>
        {/* Study type dropdown, file upload, and dynamic fields always visible */}
        <div className="mb-6">
          {/* Study type dropdown */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de estudio</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={studyType}
              onChange={e => setStudyType(e.target.value)}
            >
              <option value="oct">OCT</option>
              <option value="retinografia">Retinografía</option>
              <option value="campimetria">Campimetría</option>
              <option value="angiografia">Angiografía</option>
            </select>
          </div>
          {/* File upload always shown */}
          <div className="text-center mb-6">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Arrastre y suelte archivos aquí</h3>
              <p className="mt-1 text-sm text-gray-500">o haga clic para seleccionar</p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload-section"
            />
            <label
              htmlFor="file-upload-section"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Seleccionar archivo
            </label>
            {selectedFile && <div className="mt-2 text-sm text-gray-700">Archivo seleccionado: {selectedFile.name}</div>}
          </div>
          {/* Detectar button and fields for each study type */}
          {studyType === 'oct' && (
            <>
              <div className="flex items-center mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-md font-medium text-white ${isDetecting ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-4`}
                  disabled={isDetecting}
                  onClick={async () => {
                    setIsDetecting(true);
                    setTimeout(() => {
                      setOctFields({
                        centralThickness: '285',
                        retinalVolume: '8.7',
                        averageThickness: '310',
                      });
                      setIsDetecting(false);
                    }, 1500);
                  }}
                >
                  Detectar
                </button>
                {isDetecting && <span className="text-blue-700 font-medium">Detectando valores...</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Espesor macular central (μm)</label>
                  <input
                    type="number"
                    value={octFields.centralThickness}
                    onChange={e => setOctFields(f => ({ ...f, centralThickness: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 285"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volumen retiniano (mm³)</label>
                  <input
                    type="number"
                    value={octFields.retinalVolume}
                    onChange={e => setOctFields(f => ({ ...f, retinalVolume: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 8.7"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Espesor medio (μm)</label>
                  <input
                    type="number"
                    value={octFields.averageThickness}
                    onChange={e => setOctFields(f => ({ ...f, averageThickness: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: 310"
                  />
                </div>
              </div>
            </>
          )}
          {studyType === 'retinografia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hallazgos principales</label>
                <input
                  type="text"
                  value={retinoFields.findings}
                  onChange={e => setRetinoFields(f => ({ ...f, findings: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Drusas, hemorragias, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calidad de imagen</label>
                <input
                  type="text"
                  value={retinoFields.imageQuality}
                  onChange={e => setRetinoFields(f => ({ ...f, imageQuality: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Buena, regular, mala"
                />
              </div>
            </div>
          )}
          {studyType === 'campimetria' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">MD</label>
                <input
                  type="number"
                  value={campiFields.md}
                  onChange={e => setCampiFields(f => ({ ...f, md: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: -2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PSD</label>
                <input
                  type="number"
                  value={campiFields.psd}
                  onChange={e => setCampiFields(f => ({ ...f, psd: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 1.8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">VFI (%)</label>
                <input
                  type="number"
                  value={campiFields.vfi}
                  onChange={e => setCampiFields(f => ({ ...f, vfi: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 95"
                />
              </div>
            </div>
          )}
          {studyType === 'angiografia' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-h-[60vh] overflow-y-auto pr-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Zona avascular foveal</label>
                <input
                  type="text"
                  value={angioFields.fovealAvascularZone}
                  onChange={e => setAngioFields(f => ({ ...f, fovealAvascularZone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: 0.3 mm²"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Leakage</label>
                <input
                  type="text"
                  value={angioFields.leakage}
                  onChange={e => setAngioFields(f => ({ ...f, leakage: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Presente/ausente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Áreas no perfundidas</label>
                <input
                  type="text"
                  value={angioFields.nonPerfusedAreas}
                  onChange={e => setAngioFields(f => ({ ...f, nonPerfusedAreas: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: 2 zonas"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Microaneurismas</label>
                <input
                  type="text"
                  value={angioFields.microaneurysms}
                  onChange={e => setAngioFields(f => ({ ...f, microaneurysms: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Numerosos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Neovascularización</label>
                <input
                  type="text"
                  value={angioFields.neovascularization}
                  onChange={e => setAngioFields(f => ({ ...f, neovascularization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Dropout capilar</label>
                <input
                  type="text"
                  value={angioFields.capillaryDropout}
                  onChange={e => setAngioFields(f => ({ ...f, capillaryDropout: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Leve"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shunt arteriovenoso</label>
                <input
                  type="text"
                  value={angioFields.arteriovenousShunt}
                  onChange={e => setAngioFields(f => ({ ...f, arteriovenousShunt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Venous beading</label>
                <input
                  type="text"
                  value={angioFields.venousBeading}
                  onChange={e => setAngioFields(f => ({ ...f, venousBeading: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Moderado"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Edema macular</label>
                <input
                  type="text"
                  value={angioFields.macularEdema}
                  onChange={e => setAngioFields(f => ({ ...f, macularEdema: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Presente"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Exudados duros</label>
                <input
                  type="text"
                  value={angioFields.hardExudates}
                  onChange={e => setAngioFields(f => ({ ...f, hardExudates: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Pocos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Algodón</label>
                <input
                  type="text"
                  value={angioFields.cottonWoolSpots}
                  onChange={e => setAngioFields(f => ({ ...f, cottonWoolSpots: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hemorragias</label>
                <input
                  type="text"
                  value={angioFields.hemorrhages}
                  onChange={e => setAngioFields(f => ({ ...f, hemorrhages: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Leves"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tortuosidad vascular</label>
                <input
                  type="text"
                  value={angioFields.vesselTortuosity}
                  onChange={e => setAngioFields(f => ({ ...f, vesselTortuosity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: Aumentada"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Neovascularización coroidea</label>
                <input
                  type="text"
                  value={angioFields.choroidalNeovascularization}
                  onChange={e => setAngioFields(f => ({ ...f, choroidalNeovascularization: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: No"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Espesor retiniano central</label>
                <input
                  type="text"
                  value={angioFields.centralRetinalThickness}
                  onChange={e => setAngioFields(f => ({ ...f, centralRetinalThickness: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: 285 μm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comentarios</label>
                <textarea
                  value={angioFields.comments}
                  onChange={e => setAngioFields(f => ({ ...f, comments: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Observaciones adicionales"
                />
              </div>
            </div>
          )}
        </div>
        {/* Agregar estudio button */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={editStudyIdx === null ? handleAddStudy : handleSaveEditStudy}
            disabled={!selectedFile}
          >
            {editStudyIdx === null ? 'Agregar estudio' : 'Guardar cambios'}
          </button>
          {editStudyIdx !== null && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              onClick={handleCancelEditStudy}
            >
              Cancelar
            </button>
          )}
        </div>
        {/* List of added studies */}
        {studies.length > 0 && studies.map((study, idx) => (
          <div key={study.id} className="flex items-center gap-4 mb-2">
            <span className="text-gray-700 font-semibold">{study.type.toUpperCase()}</span>
            <span className="text-gray-700">{study.file?.name}</span>
            <button type="button" className="text-blue-600" onClick={() => handleEditStudy(idx)} disabled={editStudyIdx !== null && editStudyIdx !== idx}>Editar</button>
            <button type="button" className="text-red-500" onClick={() => handleRemoveStudy(idx)} disabled={editStudyIdx !== null}>Eliminar</button>
          </div>
        ))}
      </div>
      {/* Notas extra */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Notas extra</h2>
        <textarea className="w-full border rounded px-3 py-2 mb-2" placeholder="Notas extra" value={notasExtra} onChange={e => setNotasExtra(e.target.value)} />
      </div>
      {/* Diagnóstico presuntivo (now multiple diagnoses) */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Diagnósticos</h2>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Diagnóstico</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={diagnosisInput}
              onChange={e => setDiagnosisInput(e.target.value)}
            >
              {DIAGNOSIS_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={diagnosisStatus}
              onChange={e => setDiagnosisStatus(e.target.value as 'Presuntivo' | 'Confirmado')}
            >
              <option value="Presuntivo">Presuntivo</option>
              <option value="Confirmado">Confirmado</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="button"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleAddDiagnosis}
            >
              Agregar diagnóstico
            </button>
          </div>
        </div>
        {/* List of added diagnoses */}
        {diagnoses.length > 0 && (
          <div className="mt-2">
            {diagnoses.map((d, idx) => (
              <div key={idx} className="flex items-center gap-4 mb-2 bg-blue-50 rounded px-3 py-2">
                <span className="font-semibold text-blue-900">{d.diagnosis}</span>
                <span className="text-blue-700">{d.status}</span>
                <button type="button" className="text-red-500 ml-auto" onClick={() => handleRemoveDiagnosis(idx)}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Plan de estudios */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Plan de estudios</h2>
        <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Plan de estudios" value={planEstudios} onChange={e => setPlanEstudios(e.target.value)} />
      </div>
      {/* Plan terapéutico (dynamic dropdowns, now multiple) */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Plan terapéutico</h2>
        <select
          className="w-full border rounded px-3 py-2 mb-2"
          value={treatmentPlanInput.type}
          onChange={e => setTreatmentPlanInput(tp => ({ ...tp, type: e.target.value }))}
        >
          <option value="">Seleccione tipo de plan</option>
          <option value="farmacologico">Farmacológico</option>
          <option value="no_farmacologico">No farmacológico</option>
        </select>
        {/* No farmacológico: show text field */}
        {treatmentPlanInput.type === 'no_farmacologico' && (
          <input
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="Describa el plan no farmacológico"
            value={treatmentPlanInput.noFarm || ''}
            onChange={e => setTreatmentPlanInput(tp => ({ ...tp, noFarm: e.target.value }))}
          />
        )}
        {/* Farmacológico: show route, drug, amount, units */}
        {treatmentPlanInput.type === 'farmacologico' && (
          <>
            <select
              className="w-full border rounded px-3 py-2 mb-2"
              value={treatmentPlanInput.via || ''}
              onChange={e => setTreatmentPlanInput(tp => ({ ...tp, via: e.target.value }))}
            >
              <option value="">Seleccione vía de administración</option>
              <option value="inyeccion">Inyección</option>
              <option value="oral">Vía oral</option>
              <option value="otro">Otro</option>
            </select>
            {/* Drug and amount for each route */}
            {treatmentPlanInput.via === 'inyeccion' && (
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <select
                  className="flex-1 border rounded px-3 py-2"
                  value={treatmentPlanInput.farmaco || ''}
                  onChange={e => setTreatmentPlanInput(tp => ({ ...tp, farmaco: e.target.value }))}
                >
                  <option value="">Seleccione fármaco</option>
                  <option value="aflibercept">Aflibercept</option>
                  <option value="ranibizumab">Ranibizumab</option>
                  <option value="bevacizumab">Bevacizumab</option>
                  <option value="otro">Otro</option>
                </select>
                <input
                  className="w-24 border rounded px-3 py-2"
                  type="number"
                  min="0"
                  placeholder="Cantidad"
                  value={treatmentPlanInput.cantidad || ''}
                  onChange={e => setTreatmentPlanInput(tp => ({ ...tp, cantidad: e.target.value }))}
                />
                <select
                  className="w-32 border rounded px-3 py-2"
                  value={treatmentPlanInput.unidad || ''}
                  onChange={e => setTreatmentPlanInput(tp => ({ ...tp, unidad: e.target.value }))}
                >
                  <option value="">Unidad</option>
                  <option value="mg">mg</option>
                  <option value="ml">ml</option>
                  <option value="dosis">dosis</option>
                </select>
              </div>
            )}
            {treatmentPlanInput.via === 'oral' && (
              <div className="flex flex-col md:flex-row gap-2 mb-2">
                <select
                  className="flex-1 border rounded px-3 py-2"
                  value={treatmentPlanInput.farmaco || ''}
                  onChange={e => setTreatmentPlanInput(tp => ({ ...tp, farmaco: e.target.value }))}
                >
                  <option value="">Seleccione fármaco</option>
                  <option value="prednisona">Prednisona</option>
                  <option value="metformina">Metformina</option>
                  <option value="otro">Otro</option>
                </select>
                <input
                  className="w-24 border rounded px-3 py-2"
                  type="number"
                  min="0"
                  placeholder="Cantidad"
                  value={treatmentPlanInput.cantidad || ''}
                  onChange={e => setTreatmentPlanInput(tp => ({ ...tp, cantidad: e.target.value }))}
                />
                <select
                  className="w-32 border rounded px-3 py-2"
                  value={treatmentPlanInput.unidad || ''}
                  onChange={e => setTreatmentPlanInput(tp => ({ ...tp, unidad: e.target.value }))}
                >
                  <option value="">Unidad</option>
                  <option value="mg">mg</option>
                  <option value="comprimidos">comprimidos</option>
                  <option value="dosis">dosis</option>
                </select>
              </div>
            )}
            {treatmentPlanInput.via === 'otro' && (
              <input
                className="w-full border rounded px-3 py-2 mb-2"
                placeholder="Describa la vía y el fármaco"
                value={treatmentPlanInput.farmacoOtro || ''}
                onChange={e => setTreatmentPlanInput(tp => ({ ...tp, farmacoOtro: e.target.value }))}
              />
            )}
          </>
        )}
        <div className="flex justify-end gap-2 mt-2">
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={editTreatmentIdx === null ? handleAddTreatmentPlan : handleSaveEditTreatmentPlan}
            disabled={treatmentPlanInput.type === ''}
          >
            {editTreatmentIdx === null ? 'Agregar plan terapéutico' : 'Guardar cambios'}
          </button>
          {editTreatmentIdx !== null && (
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
              onClick={handleCancelEditTreatmentPlan}
            >
              Cancelar
            </button>
          )}
        </div>
        {/* List of added treatment plans */}
        {treatmentPlans.length > 0 && (
          <div className="mt-4 space-y-2">
            {treatmentPlans.map((plan, idx) => (
              <div key={idx} className="flex items-center gap-4 bg-green-50 rounded px-3 py-2">
                <span className="font-semibold text-green-900">{plan.type === 'farmacologico' ? 'Farmacológico' : 'No farmacológico'}</span>
                {plan.type === 'farmacologico' && (
                  <span className="text-green-700">{plan.via} {plan.farmaco} {plan.cantidad} {plan.unidad} {plan.farmacoOtro}</span>
                )}
                {plan.type === 'no_farmacologico' && (
                  <span className="text-green-700">{plan.noFarm}</span>
                )}
                <button type="button" className="text-blue-600" onClick={() => handleEditTreatmentPlan(idx)} disabled={editTreatmentIdx !== null && editTreatmentIdx !== idx}>Editar</button>
                <button type="button" className="text-red-500" onClick={() => handleRemoveTreatmentPlan(idx)} disabled={editTreatmentIdx !== null}>Eliminar</button>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Próximo control */}
      <div className="bg-white rounded-xl p-6 border">
        <h2 className="font-bold text-lg mb-4">Próximo control</h2>
        <input className="w-full border rounded px-3 py-2 mb-2" placeholder="Próximo control (fecha)" value={proximoControl} onChange={e => setProximoControl(e.target.value)} />
      </div>
      {/* Save Button */}
      <div className="flex justify-end">
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Guardar consulta
        </button>
      </div>
    </form>
  );
}

const PatientProfile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('subir');
  const { t, language } = useLanguage();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState('dmae');
  const [pendingActions, setPendingActions] = useState([
    'Sacar turno de control',
    'Realizar estudio OCT',
    'Actualizar datos de contacto'
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPending, setNewPending] = useState('');
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  const handleAddPending = () => {
    setIsModalOpen(true);
  };

  const handleModalAdd = () => {
    if (newPending.trim() !== '') {
      setPendingActions(prev => [...prev, newPending.trim()]);
      setNewPending('');
      setIsModalOpen(false);
    }
  };

  const handleModalCancel = () => {
    setNewPending('');
    setIsModalOpen(false);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper to format dates as dd/mm/yyyy
  const formatDateDMY = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
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

  // Move CustomTooltip here so it can access t and formatDate
  const CustomTooltip = ({ active, payload, label, isVisualAcuity = false }: TooltipProps<ValueType, NameType> & { isVisualAcuity?: boolean }) => {
    if (active && payload && payload.length) {
      // Find the first payload with a numeric value
      const value = typeof payload[0].value === 'number' ? payload[0].value : undefined;
      if (value === undefined) return null;
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">{formatDate(label ? String(label) : '')}</p>
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

  return (
    <div className=" mx-auto px-2 sm:px-4 w-full">
      <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6 w-full">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 w-full">
            <div className="min-w-0 flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold mr-2">{mockPatient.name}</h1>
                    <span className="bg-white/20 text-white font-semibold px-3 py-1 rounded-full text-base">
                      N° HC: {mockPatient.clinicalHistoryNumber}
                    </span>
                    <button
                      type="button"
                      aria-label={t('patientInfo')}
                      className="text-blue-100 hover:text-white focus:outline-none"
                      onClick={() => setIsInfoModalOpen(v => !v)}
                    >
                      <Info className="w-6 h-6" />
                    </button>
                  </div>
                  {isInfoModalOpen && (
                    <div className="mt-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-4 w-full max-w-4xl">
                      <h2 className="text-lg font-bold mb-2">{t('patientInfo')}</h2>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-2">
                        <div className="space-y-1">
                          <div><span className="font-semibold">DNI:</span> {mockPatient.id}</div>
                          <div><span className="font-semibold">{t('age')}:</span> {mockPatient.age} {t('years')}</div>
                        </div>
                        <div className="space-y-1">
                          <div><span className="font-semibold">{t('gender')}:</span> {mockPatient.gender}</div>
                          <div><span className="font-semibold">Obra social:</span> {mockPatient.obraSocial}</div>
                        </div>
                        <div className="space-y-1">
                          <div><span className="font-semibold">N° Afiliado:</span> {mockPatient.affiliateNumber}</div>
                          <div><span className="font-semibold">{t('contactNumber')}:</span> {mockPatient.contactNumber}</div>
                        </div>
                        <div className="space-y-1">
                          <div><span className="font-semibold">{t('email')}:</span> {mockPatient.email}</div>
                          <div><span className="font-semibold">{t('lastVisit')}:</span> {formatDateDMY(mockPatient.lastVisit)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:items-center md:justify-end mt-4 md:mt-0">
              <button className="flex-1 min-w-[180px] h-24 flex flex-col items-center justify-center px-6 py-3 bg-white text-[#2563eb] rounded-xl font-bold shadow-lg hover:bg-[#e0e7ff] transition-colors text-lg">
                <Plus className="w-6 h-6 mb-1" />
                <span>Nueva cita</span>
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
          <div className="border-b border-gray-100">
            <nav className="flex space-x-8 px-2 sm:px-6 min-w-max" aria-label="Tabs">
              {[
                { id: 'subir', label: 'Subir', icon: ClipboardList },
                { id: 'overview', label: 'Resumen', icon: Eye },
                { id: 'consultations', label: 'Consultas', icon: FileText },
                { id: 'diagnosis', label: 'Diagnósticos', icon: Activity },
                { id: 'progression', label: 'Seguimiento', icon: TrendingUp },
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Antecedentes Oftalmológicos */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{mockMedicalHistory.ophthalmological.title}</h3>
                    <div className="space-y-4">
                      {mockMedicalHistory.ophthalmological.items.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                          <p className="font-medium text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Antecedentes Personales */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{mockMedicalHistory.personal.title}</h3>
                    <div className="space-y-4">
                      {mockMedicalHistory.personal.items.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                          <p className="font-medium text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Antecedentes Familiares */}
                  <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{mockMedicalHistory.family.title}</h3>
                    <div className="space-y-4">
                      {mockMedicalHistory.family.items.map((item, index) => (
                        <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                          <p className="text-sm text-gray-500 mb-1">{item.label}</p>
                          <p className="font-medium text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'consultations' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold mb-4">Consultas previas</h2>
                {mockConsultations.map((c, idx) => (
                  <ConsultationAccordion key={c.id} consultation={c} defaultOpen={idx === 0} />
                ))}
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
                  <ul>
                    {mockRecentStudies.map(study => (
                      <li
                        key={study.id}
                        onClick={() => navigate(`/records/${study.id}`)}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm mb-2 cursor-pointer hover:bg-blue-50 transition border border-gray-100"
                      >
                        <div className="flex items-center gap-3">
                          {study.type === 'Consulta' ? (
                            <span className="bg-green-100 text-green-700 rounded-full p-2">
                              <ClipboardList className="w-5 h-5" />
                            </span>
                          ) : (
                            <span className="bg-blue-100 text-blue-700 rounded-full p-2">
                              <FileText className="w-5 h-5" />
                            </span>
                          )}
                          <div>
                            <div className="font-semibold">{study.name}</div>
                            <div className="text-xs text-gray-500">{study.type}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{study.date}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'pending' && (
              <div className="space-y-4">
                <button
                  className="mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                  onClick={handleAddPending}
                >
                  Agregar pendiente
                </button>
                {isModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
                      <h3 className="text-lg font-semibold mb-4">Agregar acción pendiente</h3>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        placeholder="Describe la acción pendiente..."
                        value={newPending}
                        onChange={e => setNewPending(e.target.value)}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
                          onClick={handleModalCancel}
                        >
                          Cancelar
                        </button>
                        <button
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium"
                          onClick={handleModalAdd}
                          disabled={newPending.trim() === ''}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="bg-yellow-50 rounded-lg p-4 flex items-center gap-4">
                  <AlertCircle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-yellow-800">Acciones pendientes</p>
                    <ul className="list-disc ml-5 text-yellow-900">
                      {pendingActions.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subir' && <SubirTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

// Accordion component for consultations
function ConsultationAccordion({ consultation, defaultOpen = false }: { consultation: ConsultationType; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-lg shadow border">
      <button
        className="w-full flex justify-between items-center px-4 py-3 text-left font-semibold text-blue-700 hover:bg-blue-50 rounded-t-lg focus:outline-none"
        onClick={() => setOpen(v => !v)}
      >
        <span>
          {consultation.date.split('-').reverse().join('/')} - {consultation.diagnosticoPresuntivo}
        </span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-6 py-4 border-t text-sm text-gray-800 space-y-2">
          <div><span className="font-semibold">Motivo de consulta:</span> {consultation.motivoConsulta}</div>
          <div><span className="font-semibold">Antecedentes de la enfermedad actual:</span> {consultation.antecedentesEnfActual}</div>
          <div><span className="font-semibold">Antecedentes patológicos personales:</span> {consultation.antecedentesPatologicos}</div>
          <div><span className="font-semibold">Medicación habitual:</span> {consultation.medicacionHabitual}</div>
          <div><span className="font-semibold">Alergias:</span> {consultation.alergias}</div>
          <div><span className="font-semibold">Antecedentes quirúrgicos:</span> {consultation.antecedentesQuirurgicos}</div>
          <div><span className="font-semibold">Antecedentes Heredo familiares:</span> {consultation.antecedentesHeredo}</div>
          <div><span className="font-semibold">Antecedentes oftalmológicos:</span> {consultation.antecedentesOftalmo}</div>
          <div><span className="font-semibold">Datos Accesorios Relevantes:</span> {consultation.datosAccesorios}</div>
          <div className="font-semibold mt-2">Examen Oftalmológico</div>
          <div className="ml-2">
            <div>Agudeza Visual Lejos: OD {consultation.examenOftalmo.agudezaVisualLejos.od}, OI {consultation.examenOftalmo.agudezaVisualLejos.oi}</div>
            <div>Agudeza Visual Cerca: OD {consultation.examenOftalmo.agudezaVisualCerca.od}, OI {consultation.examenOftalmo.agudezaVisualCerca.oi}</div>
            <div>Presión Intraocular: OD {consultation.examenOftalmo.presionIntraocular.od}, OI {consultation.examenOftalmo.presionIntraocular.oi}</div>
            <div>Fondo de ojos: {consultation.examenOftalmo.fondoOjos}</div>
            <div>Otros estudios: {consultation.examenOftalmo.otrosEstudios}</div>
          </div>
          <div><span className="font-semibold">Notas extra:</span> {consultation.notasExtra}</div>
          <div><span className="font-semibold">Diagnóstico presuntivo:</span> {consultation.diagnosticoPresuntivo}</div>
          <div><span className="font-semibold">Plan de estudios:</span> {consultation.planEstudios}</div>
          <div><span className="font-semibold">Plan terapéutico:</span> {consultation.planTerapeutico}</div>
          <div><span className="font-semibold">Próximo control:</span> {consultation.proximoControl}</div>
        </div>
      )}
    </div>
  );
}

export default PatientProfile; 