import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

// Types for block kinds
const BLOCKS = [
  { key: 'visualAcuity', label: 'Agudeza Visual' },
  { key: 'diagnostic', label: 'Diagnóstico' },
  { key: 'treatment', label: 'Tratamiento' },
] as const;
type BlockType = typeof BLOCKS[number]['key'];

type Block = {
  type: BlockType;
};

// Diagnostic and treatment options
const DIAGNOSTIC_OPTIONS = [
  'Degeneración macular relacionada con la edad (DMAE) húmeda',
  'Degeneración macular relacionada con la edad (DMAE) seca',
  'Membrana epirretiniana',
  'Agujero macular',
  'Edema macular diabético',
  'Coroidopatía serosa central',
];
const TREATMENT_OPTIONS = [
  'Inyecciones intravítreas de anti-VEGF (Aflibercept)',
  'Inyecciones intravítreas de anti-VEGF (Ranibizumab)',
  'Inyecciones intravítreas de anti-VEGF (Bevacizumab)',
  'Fotocoagulación láser',
  'Observación/seguimiento',
  'Cirugía de membrana epirretiniana',
  'Cirugía de agujero macular',
  'Corticoides intravítreos',
];

const UploadConsultation = () => {
  const { t } = useLanguage();
  // State for dynamic blocks
  const [blocks, setBlocks] = useState<Block[]>([]);
  // State for block data
  const [visualAcuity, setVisualAcuity] = useState({
    rightEye: { distance: '', near: '', withGlasses: false },
    leftEye: { distance: '', near: '', withGlasses: false },
  });
  const [diagnostic, setDiagnostic] = useState('');
  const [treatment, setTreatment] = useState('');
  const [notes, setNotes] = useState('');
  // For + menu
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Handlers for block data
  const handleVisualAcuityChange = (eye: 'rightEye' | 'leftEye', type: 'distance' | 'near', value: string) => {
    setVisualAcuity(prev => ({
      ...prev,
      [eye]: { ...prev[eye], [type]: value },
    }));
  };
  const handleGlassesToggle = (eye: 'rightEye' | 'leftEye') => {
    setVisualAcuity(prev => ({
      ...prev,
      [eye]: { ...prev[eye], withGlasses: !prev[eye].withGlasses },
    }));
  };

  // Add block
  const handleAddBlock = (type: BlockType) => {
    setBlocks(prev => [...prev, { type }]);
    setShowAddMenu(false);
  };

  // Remove block (optional, not in requirements, but could be added)
  // const handleRemoveBlock = (type: BlockType) => {
  //   setBlocks(prev => prev.filter(b => b.type !== type));
  // };

  // Which blocks are available to add
  const addedTypes = blocks.map(b => b.type);
  const availableBlocks = BLOCKS.filter(b => !addedTypes.includes(b.key));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">{t('uploadConsultation')}</h1>
      </div>
      <div className="space-y-6">
        {/* Notes field always present */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">{t('additionalNotes')}</label>
          <textarea
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t('enterAdditionalNotes')}
            value={notes}
            onChange={e => setNotes(e.target.value)}
          />
        </div>

        {/* Render dynamic blocks */}
        {blocks.map((block, idx) => {
          const handleRemove = () => setBlocks(prev => prev.filter((_, i) => i !== idx));
          if (block.type === 'visualAcuity') {
            return (
              <div key={block.type} className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Remove button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 text-gray-400 hover:text-red-500 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                  onClick={handleRemove}
                  aria-label="Eliminar bloque"
                >
                  ×
                </button>
                {/* Right Eye */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('rightEye')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('distanceVision')}</label>
                      <input
                        type="text"
                        value={visualAcuity.rightEye.distance}
                        onChange={e => handleVisualAcuityChange('rightEye', 'distance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('enterDistanceVision')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('nearVision')}</label>
                      <input
                        type="text"
                        value={visualAcuity.rightEye.near}
                        onChange={e => handleVisualAcuityChange('rightEye', 'near', e.target.value)}
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
                      <label htmlFor="rightGlasses" className="ml-2 block text-sm text-gray-700">{t('withGlasses')}</label>
                    </div>
                  </div>
                </div>
                {/* Left Eye */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">{t('leftEye')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('distanceVision')}</label>
                      <input
                        type="text"
                        value={visualAcuity.leftEye.distance}
                        onChange={e => handleVisualAcuityChange('leftEye', 'distance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={t('enterDistanceVision')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">{t('nearVision')}</label>
                      <input
                        type="text"
                        value={visualAcuity.leftEye.near}
                        onChange={e => handleVisualAcuityChange('leftEye', 'near', e.target.value)}
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
                      <label htmlFor="leftGlasses" className="ml-2 block text-sm text-gray-700">{t('withGlasses')}</label>
                    </div>
                  </div>
                </div>
              </div>
            );
          }
          if (block.type === 'diagnostic') {
            return (
              <div key={block.type} className="relative bg-gray-50 rounded-lg p-6">
                {/* Remove button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 text-gray-400 hover:text-red-500 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                  onClick={handleRemove}
                  aria-label="Eliminar bloque"
                >
                  ×
                </button>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('diagnosis') || 'Diagnóstico'}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={diagnostic}
                  onChange={e => setDiagnostic(e.target.value)}
                >
                  <option value="">Seleccione diagnóstico...</option>
                  {DIAGNOSTIC_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }
          if (block.type === 'treatment') {
            return (
              <div key={block.type} className="relative bg-gray-50 rounded-lg p-6">
                {/* Remove button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 z-10 text-gray-400 hover:text-red-500 text-xl font-bold bg-white rounded-full w-8 h-8 flex items-center justify-center shadow"
                  onClick={handleRemove}
                  aria-label="Eliminar bloque"
                >
                  ×
                </button>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('currentTreatmentPlan') || 'Tratamiento'}</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={treatment}
                  onChange={e => setTreatment(e.target.value)}
                >
                  <option value="">Seleccione tratamiento...</option>
                  {TREATMENT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            );
          }
          return null;
        })}

        {/* + Button to add blocks */}
        {availableBlocks.length > 0 && (
          <div className="flex justify-start">
            <div className="relative">
              <button
                type="button"
                className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-lg"
                onClick={() => setShowAddMenu(v => !v)}
              >
                +
              </button>
              {showAddMenu && (
                <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg">
                  {availableBlocks.map(b => (
                    <button
                      key={b.key}
                      className="block w-full text-left px-4 py-2 hover:bg-blue-50"
                      onClick={() => handleAddBlock(b.key)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

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