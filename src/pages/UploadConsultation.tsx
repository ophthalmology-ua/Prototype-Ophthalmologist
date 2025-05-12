import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const UploadConsultation = () => {
  const { t } = useLanguage();
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
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('uploadConsultation')}</h1>
      </div>
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
    </div>
  );
};

export default UploadConsultation; 