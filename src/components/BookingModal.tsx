import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { X, Clock, AlertCircle, CheckCircle, Calendar, Phone, User, Eye, AlertTriangle, Star } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBooking: (bookingData: any) => void;
  prefillData?: any;
  existingAppointments?: Array<{ date: string; time: string; patientName: string }>;
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

export default function BookingModal({ isOpen, onClose, onBooking, prefillData, existingAppointments = [] }: BookingModalProps) {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState<{
    patientName: string;
    patientPhone: string;
    patientEmail: string;
    date: any;
    time: string;
    doctor: string;
    specialty: string;
    selectedChecklistItems: string[];
    notes?: string;
  }>({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    date: null,
    time: '',
    doctor: '',
    specialty: '',
    selectedChecklistItems: [],
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  // Mock data for doctors with availability and specialties
  const doctors = [
    { 
      id: 'dr-smith', 
      name: 'Dr. Sarah Smith', 
      specialty: t('generalOphthalmology'),
      availableDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      availableHours: { start: '08:00', end: '17:00' },
      maxPatientsPerDay: 20
    },
    { 
      id: 'dr-johnson', 
      name: 'Dr. Michael Johnson', 
      specialty: t('retinaSpecialist'),
      availableDays: ['monday', 'wednesday', 'friday'],
      availableHours: { start: '09:00', end: '16:00' },
      maxPatientsPerDay: 15
    },
    { 
      id: 'dr-williams', 
      name: 'Dr. Emily Williams', 
      specialty: t('corneaSpecialist'),
      availableDays: ['tuesday', 'thursday', 'saturday'],
      availableHours: { start: '08:30', end: '16:30' },
      maxPatientsPerDay: 18
    },
    { 
      id: 'dr-brown', 
      name: 'Dr. David Brown', 
      specialty: t('glaucomaSpecialist'),
      availableDays: ['monday', 'tuesday', 'friday'],
      availableHours: { start: '09:30', end: '17:30' },
      maxPatientsPerDay: 12
    }
  ];

  const specialties = [
    t('generalOphthalmology'),
    t('retinaSpecialist'),
    t('corneaSpecialist'),
    t('glaucomaSpecialist'),
    t('pediatricOphthalmology'),
    t('neuroOphthalmology')
  ];

  // Helper function to get patient info (in real implementation this would come from API)
  const getPatientInfo = (patientId: string) => {
    // Mock patient data - in real implementation this would be an API call
    const mockPatients: Record<string, any> = {
      '32.456.789': {
        name: 'Juan Pérez',
        contactNumber: '+54 9 11 1234-5678',
        email: 'juan.perez@email.com',
        age: 65,
        gender: 'Masculino',
        obraSocial: 'OSDE 410',
        clinicalHistoryNumber: '001',
        affiliateNumber: 'OSDE-12345678',
        diagnosis: 'Degeneración macular relacionada con la edad',
        primaryPhysician: 'Dra. María González'
      }
    };
    return mockPatients[patientId] || null;
  };

  // Enhanced helper function to map appointment type to specialty with better activity matching
  const getSpecialtyFromAppointmentType = (appointmentType: string) => {
    const type = appointmentType.toLowerCase();
    if (type.includes('control') || type.includes('seguimiento') || type.includes('follow')) {
      return t('generalOphthalmology');
    } else if (type.includes('oct') || type.includes('retina') || type.includes('macula')) {
      return t('retinaSpecialist');
    } else if (type.includes('glaucoma') || type.includes('presion')) {
      return t('glaucomaSpecialist');
    } else if (type.includes('pediatric') || type.includes('pediatrico') || type.includes('nino')) {
      return t('pediatricOphthalmology');
    } else if (type.includes('neuro') || type.includes('neurologico')) {
      return t('neuroOphthalmology');
    } else if (type.includes('consulta') || type.includes('consultation')) {
      return t('generalOphthalmology');
    }
    return t('generalOphthalmology'); // default
  };

  // Enhanced helper function to get relevant checklist items based on appointment type and activity context
  const getRelevantChecklistItems = (appointmentType: string, activityContext?: string) => {
    // Enhanced mapping of appointment types to relevant checklist categories and keywords
    const appointmentTypeMapping: Record<string, { categories: string[], keywords: string[], priority: 'high' | 'medium' | 'low' }> = {
      [t('octStudy')]: {
        categories: ['examination', 'appointment'],
        keywords: ['oct', 'estudio', 'examen', 'seguimiento', 'control', 'dmae', 'retina', 'macula'],
        priority: 'high'
      },
      [t('consultation')]: {
        categories: ['appointment', 'examination'],
        keywords: ['consulta', 'consultation', 'examen', 'evaluacion', 'revision'],
        priority: 'high'
      },
      [t('followUp')]: {
        categories: ['appointment', 'examination'],
        keywords: ['control', 'follow', 'seguimiento', 'revision', 'monitoreo'],
        priority: 'medium'
      },
      [t('glaucomaConsultation')]: {
        categories: ['appointment', 'examination', 'treatment'],
        keywords: ['glaucoma', 'presion', 'pressure', 'control', 'monitoreo', 'tratamiento'],
        priority: 'high'
      },
      [t('retinalConsultation')]: {
        categories: ['appointment', 'examination', 'treatment'],
        keywords: ['retina', 'macula', 'dmae', 'oct', 'angiografia', 'fotocoagulacion'],
        priority: 'high'
      },
      [t('pediatricConsultation')]: {
        categories: ['appointment', 'examination'],
        keywords: ['pediatric', 'pediatrico', 'nino', 'infantil', 'desarrollo', 'vision'],
        priority: 'medium'
      },
      [t('neuroOphthalmologyConsultation')]: {
        categories: ['appointment', 'examination'],
        keywords: ['neuro', 'neurologico', 'nervio', 'optico', 'craneal', 'migrana'],
        priority: 'high'
      },
      [t('generalAppointment')]: {
        categories: ['appointment', 'examination', 'documentation'],
        keywords: ['general', 'consulta', 'examen', 'revision', 'documentacion'],
        priority: 'medium'
      }
    };

    const mapping = appointmentTypeMapping[appointmentType] || appointmentTypeMapping[t('generalAppointment')];
    
    // Get all checklist items that match the appointment type
    const allChecklistItems = getContextualChecklistItems();
    
    return allChecklistItems
      .filter(item => {
        // Check if item category matches
        const categoryMatch = mapping.categories.includes(item.category);
        
        // Check if item title/description contains relevant keywords
        const text = `${item.label || (item as any).title || ''} ${(item as any).description || ''}`.toLowerCase();
        const keywordMatch = mapping.keywords.some(keyword => 
          text.includes(keyword.toLowerCase())
        );
        
        // Check if activity context provides additional relevance
        const contextMatch = activityContext ? 
          mapping.keywords.some(keyword => 
            activityContext.toLowerCase().includes(keyword.toLowerCase())
          ) : false;
        
        return categoryMatch || keywordMatch || contextMatch;
      })
      .sort((a, b) => {
        // Sort by relevance score, then by priority, then by due date
        const aRelevance = getItemRelevance(a, appointmentType, activityContext);
        const bRelevance = getItemRelevance(b, appointmentType, activityContext);
        
        if (aRelevance !== bRelevance) {
          return bRelevance - aRelevance;
        }
        
        // Fallback sorting by category if priority is not available
        const aPriority = (a as any).priority === 'high' ? 3 : (a as any).priority === 'medium' ? 2 : 1;
        const bPriority = (b as any).priority === 'high' ? 3 : (b as any).priority === 'medium' ? 2 : 1;
        
        if (aPriority !== bPriority) {
          return bPriority - aPriority;
        }
        
        // Sort by due date if available
        if ((a as any).dueDate && (b as any).dueDate) {
          return new Date((a as any).dueDate).getTime() - new Date((b as any).dueDate).getTime();
        }
        
        return 0;
      })
      .map(item => item.id);
  };

  // Enhanced function to calculate item relevance score
  const getItemRelevance = (item: any, appointmentType: string, activityContext: string = '') => {
    let score = 0;
    const text = `${item.label || item.title || ''} ${item.description || ''}`.toLowerCase();
    const type = appointmentType.toLowerCase();
    const context = activityContext.toLowerCase();
    
    // Base relevance by category
    if (item.category === 'appointment') score += 10;
    if (item.category === 'examination') score += 8;
    if (item.category === 'treatment') score += 6;
    if (item.category === 'documentation') score += 4;
    
    // Enhanced appointment type matching
    if (type.includes('oct') || type.includes('estudio')) {
      if (text.includes('oct') || text.includes('estudio') || text.includes('examen') || text.includes('seguimiento')) score += 15;
      if (text.includes('dmae') || text.includes('retina') || text.includes('macula')) score += 12;
      if (text.includes('control') || text.includes('seguimiento')) score += 10;
    }
    
    if (type.includes('consulta') || type.includes('consultation')) {
      if (text.includes('consulta') || text.includes('revision') || text.includes('evaluacion')) score += 15;
      if (text.includes('sintomas') || text.includes('dolor') || text.includes('vision')) score += 12;
      if (text.includes('historial') || text.includes('antecedentes')) score += 8;
    }
    
    if (type.includes('cirugia') || type.includes('surgery')) {
      if (text.includes('cirugia') || text.includes('operacion') || text.includes('quirurgico')) score += 15;
      if (text.includes('preoperatorio') || text.includes('postoperatorio')) score += 12;
      if (text.includes('consentimiento') || text.includes('preparacion')) score += 10;
    }
    
    // Context matching
    if (context && text.includes(context)) score += 8;
    
    // Priority and status bonuses
    if (item.priority === 'high') score += 5;
    if (item.priority === 'medium') score += 3;
    if (item.status === 'overdue') score += 7;
    if (item.status === 'pending') score += 4;
    
    return score;
  };

  // Helper function to get relevance description
  const getRelevanceDescription = (appointmentType?: string, activityContext?: string) => {
    if (!appointmentType || !activityContext) return '';
    
    const type = appointmentType.toLowerCase();
    const context = activityContext.toLowerCase();
    
    if (type.includes('oct') || type.includes('estudio')) {
      if (context.includes('seguimiento') || context.includes('control')) {
        return 'Essential for OCT study follow-up appointments';
      }
      if (context.includes('dmae') || context.includes('retina')) {
        return 'Critical for retinal condition monitoring';
      }
      return 'Standard requirement for OCT studies';
    }
    
    if (type.includes('consulta') || type.includes('consultation')) {
      if (context.includes('sintomas') || context.includes('dolor')) {
        return 'Important for symptom evaluation';
      }
      if (context.includes('revision') || context.includes('control')) {
        return 'Required for routine check-up';
      }
      return 'Standard consultation requirement';
    }
    
    if (type.includes('cirugia') || type.includes('surgery')) {
      if (context.includes('preoperatorio')) {
        return 'Essential pre-surgery preparation';
      }
      if (context.includes('postoperatorio')) {
        return 'Critical post-surgery follow-up';
      }
      return 'Surgical procedure requirement';
    }
    
    return 'Relevant for this appointment type';
  };

  // Enhanced function to get context-aware checklist items based on appointment type, source, and activity
  const getContextualChecklistItems = () => {
    const baseItems = [
      { id: 'eye-exam', label: t('comprehensiveEyeExam'), category: t('examination'), relevance: 'general' },
      { id: 'vision-test', label: t('visionAcuityTest'), category: t('testing'), relevance: 'general' },
      { id: 'pressure-test', label: t('intraocularPressureTest'), category: t('testing'), relevance: 'general' },
      { id: 'dilation', label: t('pupilDilation'), category: t('examination'), relevance: 'general' },
      { id: 'retina-photo', label: t('retinalPhotography'), category: t('imaging'), relevance: 'retina' },
      { id: 'visual-field', label: t('visualFieldTest'), category: t('testing'), relevance: 'general' },
      { id: 'color-vision', label: t('colorVisionTest'), category: t('testing'), relevance: 'general' },
      { id: 'contact-fitting', label: t('contactLensFitting'), category: t('fitting'), relevance: 'general' },
      { id: 'glasses-fitting', label: t('glassesFitting'), category: t('fitting'), relevance: 'general' },
      { id: 'follow-up', label: t('followUpConsultation'), category: t('consultation'), relevance: 'general' }
    ];

    // If coming from patient checklist with appointment type, prioritize relevant items
    if (prefillData?.source === 'checklist' && prefillData?.appointmentType) {
      const appointmentType = prefillData.appointmentType.toLowerCase();
      const activityContext = prefillData.title || prefillData.description || '';
      
      // Sort items by relevance to the appointment type and activity context
      return baseItems.sort((a, b) => {
        const aRelevance = getItemRelevance(a, appointmentType, activityContext);
        const bRelevance = getItemRelevance(b, appointmentType, activityContext);
        return bRelevance - aRelevance;
      });
    }

    return baseItems;
  };

  const checklistItems = getContextualChecklistItems();

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setCurrentStep(1);
      
      // Enhanced auto-complete patient info if coming from patient checklist
      let patientInfo = null;
      if (prefillData?.patientId) {
        patientInfo = getPatientInfo(prefillData.patientId);
      }
      
      // Enhanced auto-completion logic with better patient data utilization
      const enhancedPatientInfo = {
        patientName: prefillData?.patientName || patientInfo?.name || '',
        patientPhone: prefillData?.patientPhone || patientInfo?.contactNumber || '',
        patientEmail: prefillData?.patientEmail || patientInfo?.email || ''
      };
      
      // Enhanced appointment data with activity context
      const enhancedAppointmentData = {
        ...bookingData,
        ...enhancedPatientInfo,
        specialty: prefillData?.appointmentType ? 
          getSpecialtyFromAppointmentType(prefillData.appointmentType) : 
          bookingData.specialty,
        notes: prefillData?.notes || prefillData?.reasonForVisit || (bookingData as any).notes || '',
      };
      
      setBookingData(enhancedAppointmentData);
      
      // Enhanced suggested checklist items based on activity context
      if (prefillData?.source === 'checklist' && prefillData?.appointmentType) {
        const relevantItems = getRelevantChecklistItems(
          prefillData.appointmentType, 
          prefillData.title || prefillData.description || prefillData.reasonForVisit
        );
        
        // Auto-select highly relevant items
        const autoSelectedItems = relevantItems.slice(0, 3); // Select top 3 most relevant
        
        setBookingData(prev => ({
          ...prev,
          selectedChecklistItems: autoSelectedItems
        }));
      }
      
      // Enhanced specialty auto-selection based on appointment type
      if (prefillData?.appointmentType && !enhancedAppointmentData.specialty) {
        const suggestedSpecialty = getSpecialtyFromAppointmentType(prefillData.appointmentType);
        if (suggestedSpecialty) {
          setBookingData(prev => ({ ...prev, specialty: suggestedSpecialty }));
          setCurrentStep(2); // Move to doctor selection if specialty is auto-selected
        }
      }
      
      // Enhanced context display for checklist items
      if (prefillData?.source === 'checklist') {
        console.log('Opening modal from checklist with context:', {
          appointmentType: prefillData.appointmentType,
          activityContext: prefillData.title || prefillData.description,
          relevantItems: prefillData.appointmentType ? 
            getRelevantChecklistItems(prefillData.appointmentType, prefillData.title || prefillData.description) : []
        });
      }
    } else {
      setIsVisible(false);
      // Reset form when closing
      setTimeout(() => {
        setBookingData(prev => ({
          ...prev,
          patientName: '',
          patientPhone: '',
          patientEmail: '',
          date: null,
          time: '',
          doctor: '',
          specialty: '',
          selectedChecklistItems: [],
          notes: ''
        }));
        setCurrentStep(1);
        setErrors({});
        setSelectedMonth(new Date().toISOString().split('T')[0]);
      }, 300);
    }
  }, [isOpen, prefillData]);

  useEffect(() => {
    const handleClickOutside = () => {
      // No dropdown states to manage in step-based flow
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Get available doctors for selected specialty
  const getAvailableDoctors = () => {
    if (!bookingData.specialty) return [];
    return doctors.filter(doctor => doctor.specialty === bookingData.specialty);
  };

  // Get available dates for selected doctor
  const getAvailableDates = () => {
    if (!bookingData.doctor) return [];
    
    const selectedDoctor = doctors.find(d => d.id === bookingData.doctor);
    if (!selectedDoctor) return [];

    const today = new Date();
    const availableDates = [];
    
    // Generate dates for next 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (selectedDoctor.availableDays.includes(dayName)) {
        availableDates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return availableDates;
  };

  // Get available time slots for selected doctor and date
  const getAvailableTimeSlots = () => {
    if (!bookingData.doctor || !bookingData.date) return [];
    
    const selectedDoctor = doctors.find(d => d.id === bookingData.doctor);
    if (!selectedDoctor) return [];

    const dayName = new Date(bookingData.date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (!selectedDoctor.availableDays.includes(dayName)) return [];

    // Filter time slots based on doctor's available hours
    const availableSlots = TIME_SLOTS.filter(time => {
      return time >= selectedDoctor.availableHours.start && time <= selectedDoctor.availableHours.end;
    });

    // Remove conflicting appointments
    const conflictingTimes = existingAppointments
      .filter(apt => apt.date === bookingData.date)
      .map(apt => apt.time);
    
    return availableSlots.filter(time => !conflictingTimes.includes(time));
  };

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};

    switch (currentStep) {
      case 1: // Specialty
        if (!bookingData.specialty) {
          newErrors.specialty = t('specialtyRequired') || 'Specialty is required';
        }
        break;
      case 2: // Doctor
        if (!bookingData.doctor) {
          newErrors.doctor = t('doctorRequired') || 'Doctor is required';
        }
        break;
      case 3: // Date & Time
        if (!bookingData.date) {
          newErrors.date = t('dateRequired') || 'Date is required';
        }
        if (!bookingData.time) {
          newErrors.time = t('timeRequired') || 'Time is required';
        }
        break;
      case 4: // Patient Details
        if (!bookingData.patientName.trim()) {
          newErrors.patientName = t('patientNameRequired') || 'Patient name is required';
        }
        if (bookingData.patientPhone && !/^[\+]?[1-9][\d]{0,15}$/.test(bookingData.patientPhone.replace(/\s/g, ''))) {
          newErrors.patientPhone = t('invalidPhoneNumber') || 'Invalid phone number format';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBooking = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onBooking(bookingData);
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
    
    // Reset dependent fields when specialty or doctor changes
    if (field === 'specialty') {
      setBookingData(prev => ({ ...prev, doctor: '', date: '', time: '' }));
      setCurrentStep(2);
    } else if (field === 'doctor') {
      setBookingData(prev => ({ ...prev, date: '', time: '' }));
      setCurrentStep(3);
    }
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setBookingData(prev => ({ ...prev, time }));
    // setShowTimeSlots(false); // This state was removed
    if (errors.time) {
      setErrors(prev => ({ ...prev, time: '' }));
    }
  };

  const handleChecklistItemToggle = (itemId: string) => {
    setBookingData(prev => ({
      ...prev,
      selectedChecklistItems: prev.selectedChecklistItems.includes(itemId)
        ? prev.selectedChecklistItems.filter(id => id !== itemId)
        : [...prev.selectedChecklistItems, itemId]
    }));
  };

  const checkTimeConflict = () => {
    if (!bookingData.date || !bookingData.time) return null;
    const conflict = existingAppointments.find(apt =>
      apt.date === bookingData.date && apt.time === bookingData.time
    );
    return conflict;
  };

  // Calendar helper functions
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
    return availableDates.includes(dateString);
  };

  const timeConflict = checkTimeConflict();
  const availableDoctors = getAvailableDoctors();
  const availableDates = getAvailableDates();
  const availableTimeSlots = getAvailableTimeSlots();

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
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white px-8 py-8 rounded-t-3xl relative overflow-hidden flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div>
              <h2 id="modal-title" className="text-3xl font-bold flex items-center mb-2">
                <Calendar className="w-8 h-8 mr-3 text-blue-200" />
                {t('bookAppointment')}
              </h2>
              <p className="text-blue-100 text-sm">{t('followStepsToSchedule')}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-all p-3 rounded-full hover:bg-white hover:bg-opacity-20 hover:scale-110"
              aria-label={t('closeModal') || 'Close modal'}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Step Indicator */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              {[t('specialty'), t('doctor'), t('dateTime'), t('patientDetails')].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    index + 1 < currentStep 
                      ? 'bg-green-500 text-white' 
                      : index + 1 === currentStep 
                      ? 'bg-white text-blue-600' 
                      : 'bg-blue-500/30 text-blue-200'
                  }`}>
                    {index + 1 < currentStep ? '✓' : index + 1}
                  </div>
                  <span className="ml-2 text-xs text-blue-200 hidden sm:block">{step}</span>
                  {index < 3 && (
                    <div className={`w-12 h-0.5 mx-3 ${
                      index + 1 < currentStep ? 'bg-green-500' : 'bg-blue-500/30'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {/* Step 1: Specialty Selection */}
            {currentStep === 1 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200 shadow-lg">
                <h3 className="text-2xl font-semibold text-blue-800 mb-6 flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Eye className="w-6 h-6 text-blue-600" />
                  </div>
                  {t('selectSpecialty') || 'Select a Specialty'}
                </h3>
                <p className="text-blue-700 mb-8 text-lg">
                  {t('chooseEyeCareType')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {specialties.map((specialty) => (
                    <button
                      key={specialty}
                      onClick={() => handleInputChange('specialty', specialty)}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        bookingData.specialty === specialty
                          ? 'border-blue-500 bg-blue-50 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center mb-3">
                        <Eye className={`w-6 h-6 mr-3 ${
                          bookingData.specialty === specialty ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <h4 className="font-semibold text-lg">{specialty}</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        {specialty === t('generalOphthalmology') && t('comprehensiveEyeCare')}
                        {specialty === t('retinaSpecialist') && t('retinalDiseasesTreatment')}
                        {specialty === t('corneaSpecialist') && t('corneaSurgeryDiseases')}
                        {specialty === t('glaucomaSpecialist') && t('glaucomaDiagnosisTreatment')}
                        {specialty === t('pediatricOphthalmology') && t('eyeCareChildrenInfants')}
                        {specialty === t('neuroOphthalmology') && t('neurologicalEyeDisorders')}
                      </p>
                    </button>
                  ))}
                </div>
                
                {errors.specialty && (
                  <p className="mt-4 text-sm text-red-600 flex items-center animate-pulse">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {errors.specialty}
                  </p>
                )}
              </div>
            )}

          {/* Step 2: Doctor Selection */}
          {currentStep === 2 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 shadow-lg">
              <h3 className="text-2xl font-semibold text-green-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-green-600" />
                </div>
                {t('selectDoctor') || 'Select a Doctor'}
              </h3>
              <p className="text-green-700 mb-8 text-lg">
                Elige entre nuestros especialistas en {bookingData.specialty}. Cada doctor tiene diferentes horarios disponibles.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {availableDoctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={() => handleInputChange('doctor', doctor.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                      bookingData.doctor === doctor.id
                        ? 'border-green-500 bg-green-50 shadow-lg'
                        : 'border-gray-200 bg-white hover:border-green-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center mb-4">
                      <User className={`w-8 h-8 mr-4 ${
                        bookingData.doctor === doctor.id ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <h4 className="font-semibold text-xl">{doctor.name}</h4>
                        <p className="text-green-600 font-medium">{doctor.specialty}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>{t('available')}: {doctor.availableDays.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(', ')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{t('hours')}: {doctor.availableHours.start} - {doctor.availableHours.end}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        <span>{t('maxPatientsPerDay')}: {doctor.maxPatientsPerDay}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              
              {errors.doctor && (
                <p className="mt-4 text-sm text-red-600 flex items-center animate-pulse">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {errors.doctor}
                </p>
              )}
            </div>
          )}

          {/* Step 3: Date & Time Selection */}
          {currentStep === 3 && (
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-8 border-2 border-purple-200 shadow-lg">
              <h3 className="text-2xl font-semibold text-purple-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                {t('selectDateTime') || 'Select Date & Time'}
              </h3>
              <p className="text-purple-700 mb-8 text-lg">
                {t('chooseWhenToSee').replace('{doctorName}', doctors.find(d => d.id === bookingData.doctor)?.name || 'the doctor')}
              </p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Selection */}
                <div>
                  <h4 className="text-lg font-semibold text-purple-800 mb-4">{t('selectDate')}</h4>
                  <div className="bg-white rounded-xl border-2 border-purple-200 p-4">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={() => {
                          const currentDate = new Date(selectedMonth);
                          currentDate.setMonth(currentDate.getMonth() - 1);
                          setSelectedMonth(currentDate.toISOString().split('T')[0]);
                        }}
                        className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <h5 className="text-lg font-semibold text-purple-800">
                        {new Date(selectedMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h5>
                      <button
                        onClick={() => {
                          const currentDate = new Date(selectedMonth);
                          currentDate.setMonth(currentDate.getMonth() + 1);
                          setSelectedMonth(currentDate.toISOString().split('T')[0]);
                        }}
                        className="p-2 rounded-lg hover:bg-purple-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-purple-600 py-2">
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
                              : day.toISOString().split('T')[0] === bookingData.date
                              ? 'bg-purple-500 text-white font-semibold'
                              : 'hover:bg-purple-100 text-purple-800'
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
                  <h4 className="text-lg font-semibold text-purple-800 mb-4">{t('selectTime')}</h4>
                  {bookingData.date ? (
                    <div className="max-h-64 overflow-y-auto pr-2">
                      <div className="grid grid-cols-4 gap-2">
                        {availableTimeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => handleTimeSelect(time)}
                            className={`py-2 px-3 rounded-lg border-2 transition-all duration-200 text-center text-sm font-medium hover:scale-105 hover:shadow-md ${
                              bookingData.time === time
                                ? 'border-purple-500 bg-purple-50 shadow-lg text-purple-700'
                                : 'border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50 text-gray-700'
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
                      <p>{t('pleaseSelectDateFirst')}</p>
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

              {/* Time Conflict Warning */}
              {timeConflict && (
                <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6 animate-pulse">
                  <h4 className="text-lg font-medium text-amber-800 mb-3 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3 text-amber-600" />
                    {t('timeConflictWarning') || 'Time Conflict Warning'}
                  </h4>
                  <p className="text-amber-700">
                    {t('thisTimeSlotConflicts').replace('{patientName}', timeConflict.patientName)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Patient Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              {/* Patient Information Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  {t('patientInformation') || 'Patient Information'}
                  {prefillData?.source === 'checklist' && (
                    <span className="ml-3 text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {t('autoCompletedFromChecklist') || 'Auto-completed from checklist'}
                    </span>
                  )}
                </h3>
                
                {/* Enhanced patient info display when coming from checklist */}
                {prefillData?.source === 'checklist' && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {t('checklistContext') || 'Checklist Context'}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      {prefillData?.title && (
                        <div className="flex items-center">
                          <span className="font-medium text-blue-700 mr-2">{t('activity')}:</span>
                          <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                            {prefillData.title}
                          </span>
                        </div>
                      )}
                      {prefillData?.appointmentType && (
                        <div className="flex items-center">
                          <span className="font-medium text-blue-700 mr-2">{t('appointmentType')}:</span>
                          <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                            {prefillData.appointmentType}
                          </span>
                        </div>
                      )}
                      {prefillData?.urgencyLevel && (
                        <div className="flex items-center">
                          <span className="font-medium text-blue-700 mr-2">{t('urgency')}:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            prefillData.urgencyLevel === 'high' 
                              ? 'bg-red-100 text-red-700' 
                              : prefillData.urgencyLevel === 'medium'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {prefillData.urgencyLevel === 'high' ? t('urgent') : 
                             prefillData.urgencyLevel === 'medium' ? t('normal') : t('low')}
                          </span>
                        </div>
                      )}
                      {prefillData?.dueDate && (
                        <div className="flex items-center">
                          <span className="font-medium text-blue-700 mr-2">{t('dueDate')}:</span>
                          <span className="text-blue-800 bg-blue-100 px-2 py-1 rounded-full">
                            {new Date(prefillData.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                    {prefillData?.notes && (
                      <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                        <span className="font-medium text-blue-700 mr-2">{t('notes')}:</span>
                        <span className="text-blue-800 text-sm">{prefillData.notes}</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      {t('patientName')} <span className="text-red-500">*</span>
                      {prefillData?.source === 'checklist' && (
                        <span className="ml-2 text-xs text-blue-600">
                          {t('fromChecklist') || 'from checklist'}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bookingData.patientName}
                        onChange={(e) => handleInputChange('patientName', e.target.value)}
                        placeholder={t('enterPatientName') || 'Enter patient name'}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg ${
                          errors.patientName ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 group-hover:border-blue-300'
                        } ${prefillData?.source === 'checklist' ? 'bg-blue-50 border-blue-300' : ''}`}
                      />
                      <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
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
                      {t('patientPhone')}
                      {prefillData?.source === 'checklist' && (
                        <span className="ml-2 text-xs text-blue-600">
                          {t('fromChecklist') || 'from checklist'}
                        </span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={bookingData.patientPhone}
                        onChange={(e) => handleInputChange('patientPhone', e.target.value)}
                        placeholder={t('enterPhoneNumber') || 'Enter phone number'}
                        className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 text-lg ${
                          errors.patientPhone ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-blue-400 group-hover:border-blue-300'
                        } ${prefillData?.source === 'checklist' ? 'bg-blue-50 border-blue-300' : ''}`}
                      />
                      <Phone className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                    </div>
                    {errors.patientPhone && (
                      <p className="mt-3 text-sm text-red-600 flex items-center animate-pulse">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {errors.patientPhone}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Additional patient info if available */}
                {prefillData?.patientEmail && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center text-sm text-blue-700">
                      <span className="font-medium mr-2">{t('email')}:</span>
                      <span>{prefillData.patientEmail}</span>
                      <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                        {t('fromChecklist') || 'from checklist'}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Enhanced patient details when available from mock data */}
                {prefillData?.patientId && (() => {
                  const patientInfo = getPatientInfo(prefillData.patientId);
                  if (patientInfo) {
                    return (
                      <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-semibold text-blue-700 mb-3 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {t('patientInformation') || 'Patient Information'}
                          {prefillData?.source === 'checklist' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                              {t('fromChecklist') || 'from checklist'}
                            </span>
                          )}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          {patientInfo.age && (
                            <div className="flex items-center">
                              <span className="font-medium text-blue-600 mr-2">{t('age')}:</span>
                              <span className="text-blue-800">{patientInfo.age} {t('years')}</span>
                            </div>
                          )}
                          {patientInfo.gender && (
                            <div className="flex items-center">
                              <span className="font-medium text-blue-600 mr-2">{t('gender')}:</span>
                              <span className="text-blue-800">{patientInfo.gender}</span>
                            </div>
                          )}
                          {patientInfo.obraSocial && (
                            <div className="flex items-center">
                              <span className="font-medium text-blue-600 mr-2">{t('insurance')}:</span>
                              <span className="text-blue-800">{patientInfo.obraSocial}</span>
                            </div>
                          )}
                          {patientInfo.diagnosis && (
                            <div className="flex items-center md:col-span-2">
                              <span className="font-medium text-blue-600 mr-2">{t('diagnosis')}:</span>
                              <span className="text-blue-800">{patientInfo.diagnosis}</span>
                            </div>
                          )}
                          {patientInfo.primaryPhysician && (
                            <div className="flex items-center md:col-span-2">
                              <span className="font-medium text-blue-600 mr-2">{t('primaryPhysician')}:</span>
                              <span className="text-blue-800">{patientInfo.primaryPhysician}</span>
                            </div>
                          )}
                        </div>
                        
                        {/* Enhanced context information from checklist */}
                        {prefillData?.source === 'checklist' && (
                          <div className="mt-3 pt-3 border-t border-blue-200">
                            <div className="text-xs text-blue-600 mb-2">
                              <strong>{t('appointmentContext') || 'Appointment Context'}:</strong>
                            </div>
                            <div className="space-y-1 text-xs">
                              {prefillData?.appointmentType && (
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-2 text-blue-500" />
                                  <span className="text-blue-700">
                                    {t('type')}: <strong>{prefillData.appointmentType}</strong>
                                  </span>
                                </div>
                              )}
                              {prefillData?.urgencyLevel && (
                                <div className="flex items-center">
                                  <AlertCircle className="w-3 h-3 mr-2 text-blue-500" />
                                  <span className="text-blue-700">
                                    {t('urgency')}: <strong>{prefillData.urgencyLevel}</strong>
                                  </span>
                                </div>
                              )}
                              {prefillData?.dueDate && (
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-2 text-blue-500" />
                                  <span className="text-blue-700">
                                    {t('dueDate')}: <strong>{new Date(prefillData.dueDate).toLocaleDateString()}</strong>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>

              {/* Enhanced Checklist Selection Section */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
                <h3 className="text-xl font-semibold text-green-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  {t('checklistSelection') || 'Checklist Selection'}
                </h3>
                
                {/* Enhanced context description */}
                <div className="mb-6 p-4 bg-white rounded-lg border border-green-200">
                  {prefillData?.source === 'checklist' && prefillData?.appointmentType ? (
                    <div className="space-y-2">
                      <div className="flex items-center text-green-700">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="font-medium">
                          {t('recommendedFor') || 'Recommended for'} <strong>{prefillData.appointmentType}</strong>
                        </span>
                      </div>
                      {prefillData?.title && (
                        <div className="text-sm text-green-600">
                          <strong>{t('activity')}:</strong> {prefillData.title}
                        </div>
                      )}
                      {prefillData?.description && (
                        <div className="text-sm text-green-600">
                          <strong>{t('description')}:</strong> {prefillData.description}
                        </div>
                      )}
                      <div className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded">
                        {t('autoSelectedDescription') || 'Highly relevant items have been automatically selected'}
                      </div>
                    </div>
                  ) : (
                    <p className="text-green-700 text-sm">
                      {t('checklistSelectionDescription') || 'Select the checklist items that this appointment will complete:'}
                    </p>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto pr-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {checklistItems.map((item) => {
                      const isRelevant = prefillData?.source === 'checklist' && 
                                       prefillData?.appointmentType && 
                                       getRelevantChecklistItems(prefillData.appointmentType, prefillData.title || prefillData.description).includes(item.id);
                      const isAutoSelected = bookingData.selectedChecklistItems.includes(item.id);
                      const relevanceScore = prefillData?.source === 'checklist' && prefillData?.appointmentType ? 
                        getItemRelevance(item, prefillData.appointmentType, prefillData.title || prefillData.description) : 0;
                      
                      return (
                        <label
                          key={item.id}
                          className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-sm ${
                            isRelevant 
                              ? isAutoSelected
                                ? 'bg-green-100 border-green-400 shadow-md' 
                                : 'bg-green-50 border-green-300 hover:border-green-400' 
                              : 'bg-white border-green-200 hover:border-green-300'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isAutoSelected}
                            onChange={() => handleChecklistItemToggle(item.id)}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2 mr-3"
                          />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{item.label}</div>
                            <div className="flex items-center justify-between mt-1">
                              <div className="text-xs text-green-500">{item.category}</div>
                              {isRelevant && (
                                <div className="flex items-center space-x-2">
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                    {t('recommended') || 'Recommended'}
                                  </span>
                                  {relevanceScore > 0 && (
                                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                      Score: {relevanceScore}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {isRelevant && (
                              <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded border border-green-200">
                                <div className="font-medium mb-1">
                                  {getRelevanceDescription(prefillData?.appointmentType, prefillData?.title || prefillData?.description)}
                                </div>
                                <div className="text-xs text-green-500">
                                  {(item as any).priority === 'high' && '🔥 High Priority'}
                                  {(item as any).priority === 'medium' && '⚡ Medium Priority'}
                                  {(item as any).priority === 'low' && '📋 Low Priority'}
                                  {(item as any).status === 'overdue' && ' ⚠️ Overdue'}
                                  {(item as any).status === 'pending' && ' ⏳ Pending'}
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
                
                {/* Enhanced selection summary */}
                {bookingData.selectedChecklistItems.length > 0 && (
                  <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-green-800">
                        <strong>{bookingData.selectedChecklistItems.length}</strong> {t('checklistItemsSelected') || 'checklist items selected'}
                      </div>
                      {prefillData?.source === 'checklist' && (
                        <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full">
                          {t('smartSelection') || 'Smart Selection'}
                        </span>
                      )}
                    </div>
                    {prefillData?.source === 'checklist' && (
                      <div className="mt-2 text-xs text-green-600">
                        {t('autoSelectedFromChecklist') || 'Automatically selected based on appointment type and activity context'}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Appointment Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
                <h3 className="text-xl font-semibold text-blue-800 mb-6 flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  {t('appointmentSummary') || 'Appointment Summary'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {bookingData.specialty && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">{bookingData.specialty}</span>
                    </div>
                  )}
                  {bookingData.doctor && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">{doctors.find(d => d.id === bookingData.doctor)?.name || bookingData.doctor}</span>
                    </div>
                  )}
                  {bookingData.date && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">{new Date(bookingData.date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {bookingData.time && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                      <Clock className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">{bookingData.time}</span>
                    </div>
                  )}
                  {bookingData.patientName && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100">
                      <User className="w-5 h-5 text-blue-600" />
                      <span className="text-blue-800 font-medium">{bookingData.patientName}</span>
                    </div>
                  )}
                  {bookingData.selectedChecklistItems.length > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-blue-100 md:col-span-2">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <span className="text-blue-800 font-medium">
                          {bookingData.selectedChecklistItems.length} {t('checklistItemsSelected') || 'checklist items selected'}
                        </span>
                        <div className="text-xs text-blue-600 mt-1">
                          {checklistItems
                            .filter(item => bookingData.selectedChecklistItems.includes(item.id))
                            .map(item => item.label)
                            .join(', ')}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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
              {t('previous')}
            </button>
            
            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 hover:scale-105 transition-all duration-300 font-semibold text-lg shadow-sm hover:shadow-md"
              >
                {t('cancel')}
              </button>
              
              {currentStep < 4 ? (
                                  <button
                    onClick={handleNextStep}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    {t('nextStep')}
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={isSubmitting || !!timeConflict}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-300 font-semibold text-lg flex items-center justify-center shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 disabled:hover:scale-100"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      {t('booking') || 'Booking...'}
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 mr-2" />
                      {t('bookAppointment')}
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
