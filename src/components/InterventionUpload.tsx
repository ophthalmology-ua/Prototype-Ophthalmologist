import { useState } from 'react';
import { Eye, Syringe, Scissors, FileText, Upload, X, Check } from 'lucide-react';

export interface Intervention {
  id?: string;
  type: 'injection' | 'surgery' | 'laser' | 'other';
  subtype: string;
  date: string;
  time: string;
  eye: 'OD' | 'OI' | 'Both';
  medication?: string;
  dosage?: string;
  surgeon?: string;
  assistantSurgeon?: string;
  anesthesiologist?: string;
  instrumentator?: string;
  anesthesiaType?: string;
  laserType?: string;
  notes: string;
  complications?: string;
  outcome: string;
  nextFollowUp?: string;
  files?: File[];
  isCompleted: boolean;
}

interface InterventionUploadProps {
  onSave: (intervention: Intervention) => void;
  onCancel: () => void;
  initialData?: Intervention;
  patientName: string;
}

const INJECTION_TYPES = [
  'Inyección intravítrea anti-VEGF',
  'Inyección intravítrea de corticoides',
  'Inyección subconjuntival',
  'Inyección retrobulbar',
  'Inyección peribulbar'
];

const SURGERY_TYPES = [
  'Vitrectomía',
  'Cirugía de catarata',
  'Cirugía de glaucoma',
  'Cirugía de retina',
  'Cirugía de membrana epirretiniana',
  'Cirugía de agujero macular',
  'Implante de drenaje',
  'Trabeculectomía'
];

const LASER_TYPES = [
  'Fotocoagulación láser',
  'Láser YAG',
  'Láser Argón',
  'Panfotocoagulación',
  'Trabeculoplastia láser'
];

const MEDICATIONS = [
  'Aflibercept',
  'Ranibizumab',
  'Bevacizumab',
  'Triamcinolona',
  'Dexametasona',
  'Otro'
];

const InterventionUpload: React.FC<InterventionUploadProps> = ({
  onSave,
  onCancel,
  initialData,
  patientName
}) => {
  const [intervention, setIntervention] = useState<Intervention>({
    type: 'injection',
    subtype: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    eye: 'OD',
    medication: '',
    dosage: '',
    surgeon: '',
    assistantSurgeon: '',
    anesthesiologist: '',
    instrumentator: '',
    anesthesiaType: '',
    laserType: '',
    notes: '',
    complications: '',
    outcome: '',
    nextFollowUp: '',
    files: [],
    isCompleted: true,
    ...initialData
  });

  const [isDragOver, setIsDragOver] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof Intervention, value: any) => {
    setIntervention(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setIntervention(prev => ({
        ...prev,
        files: [...(prev.files || []), ...newFiles]
      }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const removeFile = (index: number) => {
    setIntervention(prev => ({
      ...prev,
      files: prev.files?.filter((_, i) => i !== index) || []
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!intervention.subtype) {
      newErrors.subtype = 'Debe seleccionar un tipo de intervención';
    }

    if (!intervention.date) {
      newErrors.date = 'La fecha es requerida';
    }

    if (!intervention.time) {
      newErrors.time = 'La hora es requerida';
    }

    if (intervention.type === 'injection' && !intervention.medication) {
      newErrors.medication = 'Debe especificar la medicación';
    }

    if (intervention.type === 'surgery' && !intervention.surgeon) {
      newErrors.surgeon = 'Debe especificar el cirujano';
    }

    if (!intervention.outcome) {
      newErrors.outcome = 'Debe especificar el resultado';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(intervention);
    }
  };

  const getSubtypeOptions = () => {
    switch (intervention.type) {
      case 'injection':
        return INJECTION_TYPES;
      case 'surgery':
        return SURGERY_TYPES;
      case 'laser':
        return LASER_TYPES;
      default:
        return [];
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {initialData ? 'Editar Intervención' : 'Nueva Intervención'}
            </h2>
            <p className="text-gray-600">Paciente: {patientName}</p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Intervention Type Selection */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'injection', label: 'Inyección', icon: Syringe, color: 'blue' },
              { type: 'surgery', label: 'Cirugía', icon: Scissors, color: 'red' },
              { type: 'laser', label: 'Láser', icon: Eye, color: 'green' },
              { type: 'other', label: 'Otro', icon: FileText, color: 'gray' }
            ].map(({ type, label, icon: Icon, color }) => (
              <button
                key={type}
                type="button"
                onClick={() => {
                  handleInputChange('type', type);
                  handleInputChange('subtype', ''); // Reset subtype when changing type
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  intervention.type === type
                    ? `border-${color}-500 bg-${color}-50 text-${color}-700`
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                <div className="font-medium">{label}</div>
              </button>
            ))}
          </div>

          {/* Subtype Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo específico *
            </label>
            <select
              value={intervention.subtype}
              onChange={(e) => handleInputChange('subtype', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.subtype ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar tipo...</option>
              {getSubtypeOptions().map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
              {intervention.type === 'other' && (
                <option value="custom">Especificar otro...</option>
              )}
            </select>
            {errors.subtype && (
              <p className="text-red-500 text-sm mt-1">{errors.subtype}</p>
            )}
          </div>

          {/* Custom subtype input for "other" */}
          {intervention.type === 'other' && intervention.subtype === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especificar tipo de intervención *
              </label>
              <input
                type="text"
                value={intervention.subtype === 'custom' ? '' : intervention.subtype}
                onChange={(e) => handleInputChange('subtype', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Describir el tipo de intervención..."
              />
            </div>
          )}

          {/* Date, Time, and Eye Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha *
              </label>
              <input
                type="date"
                value={intervention.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora *
              </label>
              <input
                type="time"
                value={intervention.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.time ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.time && (
                <p className="text-red-500 text-sm mt-1">{errors.time}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ojo
              </label>
              <select
                value={intervention.eye}
                onChange={(e) => handleInputChange('eye', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="OD">Ojo Derecho (OD)</option>
                <option value="OI">Ojo Izquierdo (OI)</option>
                <option value="Both">Ambos Ojos</option>
              </select>
            </div>
          </div>

          {/* Injection-specific fields */}
          {intervention.type === 'injection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medicación *
                </label>
                <select
                  value={intervention.medication}
                  onChange={(e) => handleInputChange('medication', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.medication ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar medicación...</option>
                  {MEDICATIONS.map(med => (
                    <option key={med} value={med}>{med}</option>
                  ))}
                </select>
                {errors.medication && (
                  <p className="text-red-500 text-sm mt-1">{errors.medication}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosis
                </label>
                <input
                  type="text"
                  value={intervention.dosage}
                  onChange={(e) => handleInputChange('dosage', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: 2mg/0.05ml"
                />
              </div>
            </div>
          )}

          {/* Team and anesthesia fields for all types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cirujano</label>
              <input
                type="text"
                value={intervention.surgeon}
                onChange={(e) => handleInputChange('surgeon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nombre del cirujano"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cirujano asistente</label>
              <input
                type="text"
                value={intervention.assistantSurgeon}
                onChange={(e) => handleInputChange('assistantSurgeon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nombre del cirujano asistente"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Anestesiólogo</label>
              <input
                type="text"
                value={intervention.anesthesiologist}
                onChange={(e) => handleInputChange('anesthesiologist', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nombre del anestesiólogo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Instrumentador/a</label>
              <input
                type="text"
                value={intervention.instrumentator}
                onChange={(e) => handleInputChange('instrumentator', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Nombre del instrumentador/a"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de anestesia</label>
              <input
                type="text"
                value={intervention.anesthesiaType}
                onChange={(e) => handleInputChange('anesthesiaType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ej: General, local, sedación..."
              />
            </div>
          </div>

          {/* Laser-specific fields */}
          {intervention.type === 'laser' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de láser
                </label>
                <input
                  type="text"
                  value={intervention.laserType}
                  onChange={(e) => handleInputChange('laserType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ej: YAG, Argón, Diodo..."
                />
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas del procedimiento
            </label>
            <textarea
              rows={3}
              value={intervention.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles del procedimiento, técnica utilizada, etc."
            />
          </div>

          {/* Outcome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resultado *
            </label>
            <textarea
              rows={2}
              value={intervention.outcome}
              onChange={(e) => handleInputChange('outcome', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.outcome ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Resultado del procedimiento, estado del paciente post-intervención..."
            />
            {errors.outcome && (
              <p className="text-red-500 text-sm mt-1">{errors.outcome}</p>
            )}
          </div>

          {/* Complications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Complicaciones
            </label>
            <textarea
              rows={2}
              value={intervention.complications}
              onChange={(e) => handleInputChange('complications', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Complicaciones durante o después del procedimiento (si las hubo)..."
            />
          </div>

          {/* Next Follow-up */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Próximo seguimiento
            </label>
            <input
              type="date"
              value={intervention.nextFollowUp}
              onChange={(e) => handleInputChange('nextFollowUp', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Documentos adjuntos
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                isDragOver
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                Arrastre archivos aquí o{' '}
                <label className="text-blue-600 hover:text-blue-700 cursor-pointer underline">
                  haga clic para seleccionar
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-400">
                Imágenes, PDF, Word (máx. 10MB por archivo)
              </p>
            </div>

            {/* Uploaded Files */}
            {intervention.files && intervention.files.length > 0 && (
              <div className="mt-4 space-y-2">
                {intervention.files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-gray-500 mr-3" />
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-gray-500 ml-2">
                        ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isCompleted"
              checked={intervention.isCompleted}
              onChange={(e) => handleInputChange('isCompleted', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isCompleted" className="text-sm font-medium text-gray-700">
              Procedimiento completado
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
          >
            <Check className="w-4 h-4 mr-2" />
            {initialData ? 'Actualizar' : 'Guardar'} Intervención
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterventionUpload; 