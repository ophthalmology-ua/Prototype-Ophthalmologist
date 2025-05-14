import { Upload } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

const UploadStudy = () => {
  const { t } = useLanguage();
  const [detectionMode, setDetectionMode] = useState<'auto' | 'manual'>('auto');
  const [octFields, setOctFields] = useState({
    centralThickness: '',
    retinalVolume: '',
    averageThickness: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('uploadStudy')}</h1>
      </div>

      {/* Study Upload Section Only */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
          {/* Detection mode toggle */}
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="detectionMode"
                value="auto"
                checked={detectionMode === 'auto'}
                onChange={() => setDetectionMode('auto')}
              />
              Detección automática
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="detectionMode"
                value="manual"
                checked={detectionMode === 'manual'}
                onChange={() => setDetectionMode('manual')}
              />
              Ingreso manual
            </label>
          </div>
          {/* File upload always shown */}
          <div className="text-center mb-6">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">{t('dragAndDrop')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('orClickToUpload')}</p>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              {t('selectFiles')}
            </label>
          </div>
          {/* Manual OCT fields */}
          {detectionMode === 'manual' && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadStudy; 