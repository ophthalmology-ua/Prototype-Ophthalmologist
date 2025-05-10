import { Upload, File, CheckCircle, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useState } from 'react';

const UploadStudy = () => {
  const { t } = useLanguage();
  const [uploadType, setUploadType] = useState<'study' | 'consultation'>('study');
  const [visualAcuity, setVisualAcuity] = useState({
    rightEye: {
      distance: '',
      near: '',
      withGlasses: false
    },
    leftEye: {
      distance: '',
      near: '',
      withGlasses: false
    }
  });
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

  const handleVisualAcuityChange = (eye: 'rightEye' | 'leftEye', type: 'distance' | 'near', value: string) => {
    setVisualAcuity(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        [type]: value
      }
    }));
  };

  const handleGlassesToggle = (eye: 'rightEye' | 'leftEye') => {
    setVisualAcuity(prev => ({
      ...prev,
      [eye]: {
        ...prev[eye],
        withGlasses: !prev[eye].withGlasses
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('uploadStudy')}</h1>
      </div>

      {/* Upload Type Selection */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setUploadType('study')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              uploadType === 'study'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('uploadStudy')}
          </button>
          <button
            onClick={() => setUploadType('consultation')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              uploadType === 'consultation'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t('uploadConsultation')}
          </button>
        </div>

        {uploadType === 'study' ? (
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
        ) : (
          // Consultation Section
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Right Eye */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('rightEye')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('distanceVision')}
                    </label>
                    <input
                      type="text"
                      value={visualAcuity.rightEye.distance}
                      onChange={(e) => handleVisualAcuityChange('rightEye', 'distance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enterDistanceVision')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('nearVision')}
                    </label>
                    <input
                      type="text"
                      value={visualAcuity.rightEye.near}
                      onChange={(e) => handleVisualAcuityChange('rightEye', 'near', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enterNearVision')}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="rightGlasses"
                      checked={visualAcuity.rightEye.withGlasses}
                      onChange={() => handleGlassesToggle('rightEye')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rightGlasses" className="ml-2 block text-sm text-gray-700">
                      {t('withGlasses')}
                    </label>
                  </div>
                </div>
              </div>

              {/* Left Eye */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">{t('leftEye')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('distanceVision')}
                    </label>
                    <input
                      type="text"
                      value={visualAcuity.leftEye.distance}
                      onChange={(e) => handleVisualAcuityChange('leftEye', 'distance', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enterDistanceVision')}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('nearVision')}
                    </label>
                    <input
                      type="text"
                      value={visualAcuity.leftEye.near}
                      onChange={(e) => handleVisualAcuityChange('leftEye', 'near', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t('enterNearVision')}
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="leftGlasses"
                      checked={visualAcuity.leftEye.withGlasses}
                      onChange={() => handleGlassesToggle('leftEye')}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="leftGlasses" className="ml-2 block text-sm text-gray-700">
                      {t('withGlasses')}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('additionalNotes')}
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('enterAdditionalNotes')}
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {t('saveConsultation')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upload List (only shown for study uploads) */}
      {uploadType === 'study' && (
        <div className="bg-white rounded-xl shadow-sm divide-y divide-gray-200">
          {/* Upload Item */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <File className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">study-001.dcm</p>
                  <p className="text-sm text-gray-500">{t('uploadInProgress')}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-48 bg-gray-200 rounded-full h-2 mr-4">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                <button className="text-gray-400 hover:text-gray-500">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Completed Upload */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">study-002.dcm</p>
                  <p className="text-sm text-gray-500">{t('uploadComplete')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('view')}
                </button>
                <button className="text-gray-400 hover:text-gray-500">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadStudy; 