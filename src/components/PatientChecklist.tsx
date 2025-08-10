import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, AlertCircle, Calendar, FileText, Eye, Activity, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface ChecklistItem {
  id: string;
  title: string;
  description?: string;
  category: 'documentation' | 'appointment' | 'examination' | 'treatment' | 'other';
  status: 'pending' | 'completed' | 'overdue' | 'in_progress';
  dueDate?: string;
  completedDate?: string;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
  notes?: string;
}

interface PatientChecklistProps {
  patientId: string;
  patient?: {
    id: string;
    name: string;
    contactNumber: string;
    email: string;
  };
  initialItems?: ChecklistItem[];
  onItemsChange?: (items: ChecklistItem[]) => void;
  onOpenAppointmentModal?: (prefillData: any) => void;
  onOpenStudyModal?: (prefillData: any) => void;
  onOpenTreatmentModal?: (prefillData: any) => void;
  onOpenDocumentModal?: (prefillData: any) => void;
}

const categoryIcons = {
  documentation: FileText,
  appointment: Calendar,
  examination: Eye,
  treatment: Activity,
  other: AlertCircle
};

const priorityColors = {
  high: 'text-red-500',
  medium: 'text-yellow-500',
  low: 'text-blue-500'
};

const statusColors = {
  pending: 'bg-yellow-50 border-yellow-200',
  completed: 'bg-green-50 border-green-200',
  overdue: 'bg-red-50 border-red-200',
  in_progress: 'bg-blue-50 border-blue-200'
};

const statusTextColors = {
  pending: 'text-yellow-700',
  completed: 'text-green-700',
  overdue: 'text-red-700',
  in_progress: 'text-blue-700'
};

export default function PatientChecklist({ 
  patientId, 
  patient, 
  initialItems = [], 
  onItemsChange,
  onOpenAppointmentModal,
  onOpenStudyModal,
  onOpenTreatmentModal,
  onOpenDocumentModal
}: PatientChecklistProps) {
  const { t } = useLanguage();
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);

  // This component provides action buttons that navigate to relevant pages
  // with pre-filled data from the checklist item. The target pages can access
  // this data using: const location = useLocation(); const prefillData = location.state?.prefillData;

  const handleStatusChange = (id: string, newStatus: ChecklistItem['status']) => {
    const updatedItems = items.map(item =>
      item.id === id
        ? {
            ...item,
            status: newStatus,
            completedDate: newStatus === 'completed' ? new Date().toISOString() : undefined
          }
        : item
    );
    setItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const getStatusIcon = (status: ChecklistItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Circle className="w-5 h-5 text-yellow-500" />;
      case 'overdue':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'in_progress':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const extractAppointmentType = (title: string, description?: string): string => {
    const text = `${title} ${description || ''}`.toLowerCase();
    if (text.includes('oct') || text.includes('estudio')) return t('octStudy');
    if (text.includes('consulta') || text.includes('consultation')) return t('consultation');
    if (text.includes('control') || text.includes('follow') || text.includes('seguimiento')) return t('followUp');
    if (text.includes('tratamiento') || text.includes('treatment')) return t('treatment');
    if (text.includes('glaucoma') || text.includes('presion')) return t('glaucomaConsultation');
    if (text.includes('retina') || text.includes('macula')) return t('retinalConsultation');
    if (text.includes('pediatric') || text.includes('pediatrico') || text.includes('nino')) return t('pediatricConsultation');
    if (text.includes('neuro') || text.includes('neurologico')) return t('neuroOphthalmologyConsultation');
    return t('generalAppointment');
  };

  const extractStudyType = (title: string, description?: string): string => {
    const text = `${title} ${description || ''}`.toLowerCase();
    if (text.includes('oct')) return t('oct');
    if (text.includes('fondo') || text.includes('fundus')) return t('fundusPhotography');
    if (text.includes('presion') || text.includes('pressure')) return t('intraocularPressure');
    if (text.includes('agudeza') || text.includes('acuity')) return t('visualAcuityTest');
    return t('generalEyeExam');
  };

  const extractDocumentType = (title: string, description?: string): string => {
    const text = `${title} ${description || ''}`.toLowerCase();
    if (text.includes('dni') || text.includes('identity')) return t('idDocument');
    if (text.includes('obra social') || text.includes('insurance')) return t('insuranceCard');
    if (text.includes('historia') || text.includes('history')) return t('medicalHistory');
    if (text.includes('estudios') || text.includes('studies')) return t('previousStudies');
    return t('generalDocumentation');
  };

  const handleOpenAppointmentModal = (item: ChecklistItem) => {
    const appointmentType = extractAppointmentType(item.title);
    
    // Enhanced prefill data with more patient context and activity details
    const enhancedPrefillData = {
      patientId: patientId,
      patientName: patient?.name || patientId, // Use patient name if available, otherwise patientId
      patientPhone: patient?.contactNumber || 'N/A', // Use patient phone if available, otherwise 'N/A'
      patientEmail: patient?.email || 'N/A', // Use patient email if available, otherwise 'N/A'
      appointmentType: appointmentType,
      title: item.title,
      description: item.description,
      category: item.category,
      priority: item.priority,
      status: item.status,
      dueDate: item.dueDate,
      source: 'checklist',
      checklistItemId: item.id,
      // Additional context for better todo suggestions
      activityContext: {
        type: item.category,
        priority: item.priority,
        status: item.status,
        isOverdue: item.status === 'overdue',
        isHighPriority: item.priority === 'high',
        requiresFollowUp: item.category === 'appointment' || item.category === 'examination'
      }
    };
    
    if (onOpenAppointmentModal) {
      onOpenAppointmentModal(enhancedPrefillData);
    }
  };

  const getActionButton = (item: ChecklistItem) => {
    const baseButtonClass = "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors";
    
    // Special handling for "realizar estudio" items - show both options
    if (item.category === 'examination' && 
        (item.title.toLowerCase().includes('realizar estudio') || 
         item.title.toLowerCase().includes('estudio') ||
         item.title.toLowerCase().includes('examen'))) {
      return (
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => handleOpenAppointmentModal(item)}
            className={`${baseButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
          >
            <Calendar className="w-4 h-4" />
            {t('scheduleAppointment') || 'Sacar Turno'}
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onOpenStudyModal?.({
              patientId: patientId,
              studyType: extractStudyType(item.title, item.description),
              description: item.description || item.title,
              priority: item.priority,
              dueDate: item.dueDate,
              notes: item.notes,
              checklistItemId: item.id,
              source: 'checklist',
              requiredPreparation: item.title.toLowerCase().includes('oct') ? t('dilatedPupils') : t('none'),
              action: 'upload' // Indicate this is for uploading study
            })}
            className={`${baseButtonClass} bg-purple-100 text-purple-700 hover:bg-purple-200`}
          >
            <Eye className="w-4 h-4" />
            {t('uploadStudy') || 'Subir Estudio'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      );
    }
    
    switch (item.category) {
      case 'appointment':
        return (
          <button
            onClick={() => handleOpenAppointmentModal(item)}
            className={`${baseButtonClass} bg-blue-100 text-blue-700 hover:bg-blue-200`}
          >
            <Calendar className="w-4 h-4" />
            {t('bookAppointment')}
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      
      case 'documentation':
        return (
          <button
            onClick={() => onOpenDocumentModal?.({
              patientId: patientId,
              documentType: extractDocumentType(item.title, item.description),
              requiredDocuments: item.description || item.title,
              priority: item.priority,
              dueDate: item.dueDate,
              notes: item.notes,
              checklistItemId: item.id,
              source: 'checklist'
            })}
            className={`${baseButtonClass} bg-green-100 text-green-700 hover:bg-green-200`}
          >
            <FileText className="w-4 h-4" />
            {t('viewDocuments')}
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      
      case 'examination':
        return (
          <button
            onClick={() => onOpenStudyModal?.({
              patientId: patientId,
              studyType: extractStudyType(item.title, item.description),
              description: item.description || item.title,
              priority: item.priority,
              dueDate: item.dueDate,
              notes: item.notes,
              checklistItemId: item.id,
              source: 'checklist',
              requiredPreparation: item.title.toLowerCase().includes('oct') ? t('dilatedPupils') : t('none')
            })}
            className={`${baseButtonClass} bg-purple-100 text-purple-700 hover:bg-purple-200`}
          >
            <Eye className="w-4 h-4" />
            {t('scheduleStudy')}
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      
      case 'treatment':
        return (
          <button
            onClick={() => onOpenTreatmentModal?.({
              patientId: patientId,
              consultationType: item.title.toLowerCase().includes('follow') ? t('followUp') : t('initialConsultation'),
              diagnosis: item.description || item.title,
              priority: item.priority,
              dueDate: item.dueDate,
              notes: item.notes,
              checklistItemId: item.id,
              source: 'checklist'
            })}
            className={`${baseButtonClass} bg-orange-100 text-orange-700 hover:bg-orange-200`}
          >
            <Activity className="w-4 h-4" />
            {t('viewTreatment')}
            <ArrowRight className="w-4 h-4" />
          </button>
        );
      
      default:
        return (
          <button
            onClick={() => onOpenDocumentModal?.({
              patientId: patientId,
              documentType: extractDocumentType(item.title, item.description),
              requiredDocuments: item.description || item.title,
              priority: item.priority,
              dueDate: item.dueDate,
              notes: item.notes,
              checklistItemId: item.id,
              source: 'checklist'
            })}
            className={`${baseButtonClass} bg-gray-100 text-gray-700 hover:bg-gray-200`}
          >
            <AlertCircle className="w-4 h-4" />
            {t('viewDetails')}
            <ArrowRight className="w-4 h-4" />
          </button>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            className={`flex items-start gap-4 p-4 rounded-lg border ${statusColors[item.status]}`}
          >
            <button
              onClick={() => {
                const nextStatus = item.status === 'completed' ? 'pending' : 'completed';
                handleStatusChange(item.id, nextStatus);
              }}
              className="mt-1"
            >
              {getStatusIcon(item.status)}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className={`font-medium ${statusTextColors[item.status]}`}>
                    {item.title}
                  </h4>
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.category && categoryIcons[item.category] && (
                    <span className="text-gray-500">
                      {React.createElement(categoryIcons[item.category], { size: 16 })}
                    </span>
                  )}
                  <span className={`text-xs font-medium ${priorityColors[item.priority]}`}>
                    {item.priority === 'high' ? t('high') : item.priority === 'medium' ? t('medium') : t('low')}
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-3">
                {getActionButton(item)}
              </div>

              {item.dueDate && (
                <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{t('dueDate')}: {new Date(item.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {item.completedDate && (
                <div className="flex items-center gap-1 mt-1 text-sm text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t('completed')}: {new Date(item.completedDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{t('noChecklistItems')}</p>
            <p className="text-sm">{t('checklistItemsAddedAutomatically')}</p>
          </div>
        )}
      </div>
    </div>
  );
}