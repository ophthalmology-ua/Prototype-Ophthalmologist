import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { ArrowLeft, FileText } from 'lucide-react';

// Mock data for demonstration
const mockRecords = [
  {
    id: '1',
    type: 'study',
    studyName: 'OCT',
    date: '2024-02-01',
    doctor: 'Dra. María González',
    fileName: 'oct_sample.png',
    fileUrl: '/oct_sample.png',
    uploadedAt: '2024-06-01',
    patientName: 'Juan Pérez',
    macularThickness: 285,
    centralThickness: 285,
    retinalVolume: 8.7,
    averageThickness: 310,
    observation: 'No se observa líquido subretiniano. Espesor macular dentro de parámetros normales.'
  },
  {
    id: '2',
    type: 'consultation',
    patientName: 'Juan Pérez',
    date: '2024-06-02',
    rightEye: { distance: '20/20', near: 'J1', withGlasses: true },
    leftEye: { distance: '20/25', near: 'J2', withGlasses: false },
    notes: 'Paciente refiere mejoría con el tratamiento.'
  }
];

export default function RecordDetail() {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const record = mockRecords.find(r => r.id === id);

  if (!record) {
    return <div className="p-8 text-center text-gray-500">Registro no encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button className="flex items-center mb-6 text-blue-600 hover:underline" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-5 h-5 mr-2" /> {t('back') || 'Volver'}
      </button>
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          {record.studyName}
        </h1>
        <div className="mb-2 text-gray-600 flex flex-col sm:flex-row sm:items-center gap-2">
          <span>{t('date')}: <span className="font-medium">{record.date}</span></span>
          <span>•</span>
          <span>{t('doctor')}: <span className="font-medium">{record.doctor}</span></span>
        </div>
        <p className="text-gray-600 mb-2">{t('name')}: <span className="font-medium">{record.patientName}</span></p>
        {record.type === 'study' ? (
          <>
            {record.fileName && record.fileName.match(/\.(png|jpg|jpeg|gif)$/i) && (
              <div className="mb-6 flex justify-center">
                <img src={record.fileUrl} alt={record.fileName} className="w-full max-w-3xl h-auto rounded shadow" />
              </div>
            )}
            <p className="mb-4">{t('file') || 'Archivo'}: <span className="font-medium">{record.fileName}</span></p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Valores obtenidos</h3>
              <p>Espesor macular central: <span className="font-medium">{record.centralThickness} μm</span></p>
              <p>Volumen retiniano: <span className="font-medium">{record.retinalVolume} mm³</span></p>
              <p>Espesor medio: <span className="font-medium">{record.averageThickness} μm</span></p>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-1">Observaciones del médico</h4>
              <p className="bg-gray-50 rounded p-3 text-gray-700">{record.observation}</p>
            </div>
            <p className="mt-4 text-sm text-gray-400">{t('uploadedAt') || 'Subido el'}: {record.uploadedAt}</p>
          </>
        ) : (
          <>
            <p className="mb-2">{t('date')}: <span className="font-medium">{record.date}</span></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
              <div>
                <h3 className="font-semibold mb-2">{t('rightEye') || 'Ojo derecho'}</h3>
                <p>{t('distanceVision')}: {record.rightEye?.distance}</p>
                <p>{t('nearVision')}: {record.rightEye?.near}</p>
                <p>{t('withGlasses')}: {record.rightEye?.withGlasses ? t('yes') : t('no')}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">{t('leftEye') || 'Ojo izquierdo'}</h3>
                <p>{t('distanceVision')}: {record.leftEye?.distance}</p>
                <p>{t('nearVision')}: {record.leftEye?.near}</p>
                <p>{t('withGlasses')}: {record.leftEye?.withGlasses ? t('yes') : t('no')}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-1">{t('notes')}</h4>
              <p className="bg-gray-50 rounded p-3 text-gray-700">{record.notes}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 