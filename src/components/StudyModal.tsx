import { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, CheckCircle, Calendar, Phone, User, Eye, Star } from 'lucide-react';

interface StudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudyScheduled: (studyData: any) => void;
  prefillData?: any;
  existingStudies?: Array<{ date: string; type: string; patientName: string; status: string }>;
}

const STUDY_TYPES = [
  'OCT (Tomografía de Coherencia Óptica)',
  'Fotografía de Fondo de Ojo',
  'Presión Intraocular',
  'Agudeza Visual',
  'Campimetría',
  'Biometría',
  'Ecografía Ocular',
  'Angiografía con Fluoresceína'
];

const PREPARATION_REQUIREMENTS = {
  'OCT (Tomografía de Coherencia Óptica)': 'Pupilas dilatadas, sin lentes de contacto',
  'Fotografía de Fondo de Ojo': 'Pupilas dilatadas',
  'Presión Intraocular': 'Sin preparación especial',
  'Agudeza Visual': 'Sin preparación especial',
  'Campimetría': 'Pupilas dilatadas',
  'Biometría': 'Sin preparación especial',
  'Ecografía Ocular': 'Sin preparación especial',
  'Angiografía con Fluoresceína': 'Ayunas 4 horas, pupilas dilatadas'
};

export default function StudyModal({ isOpen, onClose, onStudyScheduled, prefillData }: StudyModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [studyData, setStudyData] = useState<{
    studyType: string;
    description: string;
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    date: any;
    time: string;
    priority: 'high' | 'medium' | 'low';
    notes?: string;
    preparationRequired: string;
    estimatedDuration: string;
    cost: string;
  }>({
    studyType: '',
    description: '',
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    date: null,
    time: '',
    priority: 'medium',
    notes: '',
    preparationRequired: '',
    estimatedDuration: '',
    cost: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const TIME_SLOTS = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  // Mock data for study rooms and technicians
  const studyRooms = [
    { 
      id: 'room-1', 
      name: 'Sala de Estudios 1', 
      equipment: ['OCT', 'Fotografía de Fondo'],
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableHours: { start: '08:00', end: '17:00' }
    },
    { 
      id: 'room-2', 
      name: 'Sala de Estudios 2', 
      equipment: ['Presión Intraocular', 'Agudeza Visual', 'Campimetría'],
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableHours: { start: '08:30', end: '16:30' }
    },
    { 
      id: 'room-3', 
      name: 'Sala de Estudios 3', 
      equipment: ['Biometría', 'Ecografía', 'Angiografía'],
      availableDays: ['tuesday', 'thursday', 'saturday'],
      availableHours: { start: '09:00', end: '15:00' }
    }
  ];

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      if (prefillData) {
        setStudyData(prev => ({
          ...prev,
          studyType: prefillData.studyType || '',
          description: prefillData.description || '',
          patientName: prefillData.patientName || '',
          patientPhone: prefillData.patientPhone || '',
          patientEmail: prefillData.patientEmail || '',
          priority: prefillData.priority || 'medium',
          notes: prefillData.notes || '',
          preparationRequired: prefillData.requiredPreparation || ''
        }));
      }
    } else {
      setIsVisible(false);
    }
  }, [isOpen, prefillData]);

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        if (!isOpen) {
          setCurrentStep(1);
          setStudyData({
            studyType: '',
            description: '',
            patientName: '',
            patientPhone: '',
            patientEmail: '',
            date: null,
            time: '',
            priority: 'medium',
            notes: '',
            preparationRequired: '',
            estimatedDuration: '',
            cost: ''
          });
          setErrors({});
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      onClose();
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) { // Exclude Sundays
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const getAvailableTimeSlots = () => {
    return TIME_SLOTS;
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    
    if (currentStep === 1) {
      if (!studyData.studyType) newErrors.studyType = 'Seleccione un tipo de estudio';
      if (!studyData.description) newErrors.description = 'Ingrese una descripción';
    } else if (currentStep === 2) {
      if (!studyData.date) newErrors.date = 'Seleccione una fecha';
      if (!studyData.time) newErrors.time = 'Seleccione un horario';
    } else if (currentStep === 3) {
      if (!studyData.patientName) newErrors.patientName = 'Ingrese el nombre del paciente';
      if (!studyData.patientPhone) newErrors.patientPhone = 'Ingrese el teléfono del paciente';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleStudyScheduled = async () => {
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const finalStudyData = {
        ...studyData,
        id: Date.now().toString(),
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };
      
      onStudyScheduled(finalStudyData);
      onClose();
    } catch (error) {
      console.error('Error scheduling study:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setStudyData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTimeSelect = (time: string) => {
    handleInputChange('time', time);
  };

  const getCalendarDays = () => {
    const year = new Date(selectedMonth).getFullYear();
    const month = new Date(selectedMonth).getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const isDateAvailable = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return getAvailableDates().includes(dateString);
  };

  const getStudyRoom = () => {
    return studyRooms.find(room => 
      room.equipment.some(equipment => 
        studyData.studyType.includes(equipment)
      )
    );
  };

  const getEstimatedDuration = () => {
    switch (studyData.studyType) {
      case 'OCT (Tomografía de Coherencia Óptica)': return '15-20 minutos';
      case 'Fotografía de Fondo de Ojo': return '10-15 minutos';
      case 'Presión Intraocular': return '5-10 minutos';
      case 'Agudeza Visual': return '10-15 minutos';
      case 'Campimetría': return '20-30 minutos';
      case 'Biometría': return '10-15 minutos';
      case 'Ecografía Ocular': return '15-20 minutos';
      case 'Angiografía con Fluoresceína': return '30-45 minutos';
      default: return '15-20 minutos';
    }
  };

  const getStudyCost = () => {
    switch (studyData.studyType) {
      case 'OCT (Tomografía de Coherencia Óptica)': return '$150.000';
      case 'Fotografía de Fondo de Ojo': return '$80.000';
      case 'Presión Intraocular': return '$30.000';
      case 'Agudeza Visual': return '$25.000';
      case 'Campimetría': return '$120.000';
      case 'Biometría': return '$90.000';
      case 'Ecografía Ocular': return '$100.000';
      case 'Angiografía con Fluoresceína': return '$200.000';
      default: return '$100.000';
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className={`bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[95vh] flex flex-col border border-gray-100 transition-all duration-300 transform ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Fixed Header */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white px-8 py-8 rounded-t-3xl relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 id="modal-title" className="text-3xl font-bold flex items-center mb-2">
                <Eye className="w-8 h-8 mr-3 text-purple-200" />
                Programar Estudio
              </h2>
              <p className="text-purple-100 text-sm">Siga los pasos para programar el estudio oftalmológico</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-100 transition-all p-3 rounded-full hover:bg-white hover:bg-opacity-20 hover:scale-110"
              aria-label="Cerrar modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              {['Tipo de Estudio', 'Fecha y Hora', 'Datos del Paciente', 'Resumen'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index + 1 < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index + 1 === currentStep 
                      ? 'bg-white text-purple-600' 
                      : 'bg-purple-500/30 text-purple-200'
                  }`}>
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="ml-2 text-xs text-purple-200 hidden sm:block">{step}</span>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-3 ${
                      index + 1 < currentStep ? 'bg-green-500' : 'bg-purple-500/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Step 1: Study Type Selection */}
          {currentStep === 1 && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
              <h3 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                Seleccionar Tipo de Estudio
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {STUDY_TYPES.map((studyType) => (
                  <button
                    key={studyType}
                    onClick={() => {
                      handleInputChange('studyType', studyType);
                      handleInputChange('preparationRequired', PREPARATION_REQUIREMENTS[studyType as keyof typeof PREPARATION_REQUIREMENTS]);
                      handleInputChange('estimatedDuration', getEstimatedDuration());
                      handleInputChange('cost', getStudyCost());
                    }}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      studyData.studyType === studyType
                        ? 'border-purple-500 bg-purple-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center mb-3">
                      <Eye className={`w-6 h-6 mr-3 ${
                        studyData.studyType === studyType ? 'text-purple-600' : 'text-gray-400'
                      }`} />
                      <h4 className="font-semibold text-lg">{studyType}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Preparación: {PREPARATION_REQUIREMENTS[studyType as keyof typeof PREPARATION_REQUIREMENTS]}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-600 font-medium">
                        Duración: {getEstimatedDuration()}
                      </span>
                      <span className="text-green-600 font-medium">
                        {getStudyCost()}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {studyData.studyType && (
                <div className="mt-6 p-4 bg-white rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">Descripción del Estudio</h4>
                  <textarea
                    value={studyData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describa el motivo del estudio, síntomas, o indicaciones médicas..."
                    className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                    rows={3}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.description}
                    </p>
                  )}
                </div>
              )}
              
              {errors.studyType && (
                <p className="mt-4 text-sm text-red-600 flex items-center animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.studyType}
                </p>
              )}
            </div>
          )}

          {/* Step 2: Date & Time Selection */}
          {currentStep === 2 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
              <h3 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                Seleccionar Fecha y Hora
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">Seleccionar Fecha</h4>
                  <div className="bg-white rounded-xl border-2 border-blue-200 p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          const currentDate = new Date(selectedMonth);
                          currentDate.setMonth(currentDate.getMonth() - 1);
                          setSelectedMonth(currentDate.toISOString().split('T')[0]);
                        }}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h5 className="text-lg font-semibold text-blue-800">
                        {new Date(selectedMonth).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                      </h5>
                      <button
                        onClick={() => {
                          const currentDate = new Date(selectedMonth);
                          currentDate.setMonth(currentDate.getMonth() + 1);
                          setSelectedMonth(currentDate.toISOString().split('T')[0]);
                        }}
                        className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-blue-600 py-2">
                          {day}
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {getCalendarDays().map((day, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            if (day && isDateAvailable(day)) {
                              handleInputChange('date', day.toISOString().split('T')[0]);
                            }
                          }}
                          disabled={!day || !isDateAvailable(day)}
                          className={`p-2 rounded-lg text-sm transition-all duration-200 ${
                            !day || !isDateAvailable(day)
                              ? 'text-gray-300 cursor-not-allowed'
                              : day.toISOString().split('T')[0] === studyData.date
                              ? 'bg-blue-500 text-white font-semibold'
                              : 'hover:bg-blue-100 text-blue-800'
                          }`}
                        >
                          {day ? day.getDate() : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {errors.date && (
                    <p className="mt-3 text-sm text-red-600 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.date}
                    </p>
                  )}
                </div>

                {/* Time Selection */}
                <div>
                  <h4 className="text-lg font-semibold text-blue-800 mb-4">Seleccionar Hora</h4>
                  {studyData.date ? (
                    <div className="max-h-64 overflow-y-auto pr-2">
                      <div className="grid grid-cols-4 gap-2">
                        {getAvailableTimeSlots().map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`py-2 px-3 rounded-lg border-2 transition-all duration-200 text-center text-sm font-medium hover:scale-105 hover:shadow-md ${
                              studyData.time === time
                                ? 'border-blue-500 bg-blue-50 shadow-lg text-blue-700'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>Por favor seleccione una fecha primero</p>
                    </div>
                  )}
                  
                  {errors.time && (
                    <p className="mt-3 text-sm text-red-600 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.time}
                    </p>
                  )}
                </div>
              </div>

              {/* Study Room Information */}
              {studyData.studyType && (
                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                  <h4 className="text-lg font-medium text-green-800 mb-3 flex items-center">
                    <Eye className="w-5 h-5 mr-2" />
                    Información de la Sala
                  </h4>
                  {(() => {
                    const room = getStudyRoom();
                    return room ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-green-700">Sala:</span>
                          <span className="ml-2 text-green-800">{room.name}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Equipamiento:</span>
                          <span className="ml-2 text-green-800">{room.equipment.join(', ')}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Días disponibles:</span>
                          <span className="ml-2 text-green-800">
                            {room.availableDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700">Horarios:</span>
                          <span className="ml-2 text-green-800">{room.availableHours.start} - {room.availableHours.end}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-green-700">Sala disponible para este tipo de estudio</p>
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Patient Details */}
          {currentStep === 3 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
              <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                Información del Paciente
                {prefillData?.source === 'checklist' && (
                  <span className="ml-3 text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Auto-completado desde checklist
                  </span>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nombre del Paciente <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={studyData.patientName}
                      onChange={(e) => handleInputChange('patientName', e.target.value)}
                      placeholder="Ingrese el nombre del paciente"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg ${
                        errors.patientName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400 group-hover:border-green-300'
                      }`}
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  {errors.patientName && (
                    <p className="mt-3 text-sm text-red-600 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.patientName}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={studyData.patientPhone}
                      onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                      placeholder="Ingrese el número de teléfono"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 text-lg ${
                        errors.patientPhone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-green-400 group-hover:border-green-300'
                      }`}
                    />
                    <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                  </div>
                  {errors.patientPhone && (
                    <p className="mt-3 text-sm text-red-600 flex items-center animate-pulse">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {errors.patientPhone}
                    </p>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Notas Adicionales
                </label>
                <textarea
                  value={studyData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder="Agregue notas adicionales, instrucciones especiales, o comentarios..."
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
              <h3 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                </div>
                Resumen del Estudio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {studyData.studyType && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">{studyData.studyType}</span>
                  </div>
                )}
                {studyData.date && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">{new Date(studyData.date).toLocaleDateString()}</span>
                  </div>
                )}
                {studyData.time && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">{studyData.time}</span>
                  </div>
                )}
                {studyData.patientName && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">{studyData.patientName}</span>
                  </div>
                )}
                {studyData.preparationRequired && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100 md:col-span-2">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <span className="text-blue-800 font-medium">Preparación Requerida</span>
                      <div className="text-xs text-blue-600 mt-1">{studyData.preparationRequired}</div>
                    </div>
                  </div>
                )}
                {studyData.estimatedDuration && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">Duración: {studyData.estimatedDuration}</span>
                  </div>
                )}
                {studyData.cost && (
                  <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">Costo: {studyData.cost}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Fixed Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-8 rounded-b-3xl border-t-2 border-gray-200 flex-shrink-0">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Anterior
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md"
              >
                Cancelar
              </button>
              
              {currentStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Siguiente
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={handleStudyScheduled}
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Programando...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 mr-2" />
                      Programar Estudio
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
