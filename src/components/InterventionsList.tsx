import { useState } from 'react';
import { 
  Syringe, 
  Scissors, 
  Eye, 
  FileText, 
  Calendar, 
  Clock, 
  Edit, 
  Trash2, 
  Plus,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import InterventionUpload, { Intervention } from './InterventionUpload';
import { useNavigate } from 'react-router-dom';

interface InterventionsListProps {
  interventions: Intervention[];
  onAddIntervention: (intervention: Intervention) => void;
  onUpdateIntervention: (id: string, intervention: Intervention) => void;
  onDeleteIntervention: (id: string) => void;
  patientName: string;
}

const InterventionsList: React.FC<InterventionsListProps> = ({
  interventions,
  onAddIntervention,
  onUpdateIntervention,
  onDeleteIntervention,
  patientName
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSaveIntervention = (intervention: Intervention) => {
    if (editingIntervention?.id) {
      onUpdateIntervention(editingIntervention.id, intervention);
    } else {
      onAddIntervention({ ...intervention, id: Date.now().toString() });
    }
    setShowUpload(false);
    setEditingIntervention(null);
  };

  const handleCancelUpload = () => {
    setShowUpload(false);
    setEditingIntervention(null);
  };

  const handleEditIntervention = (intervention: Intervention) => {
    setEditingIntervention(intervention);
    setShowUpload(true);
  };

  const handleDeleteIntervention = (id: string) => {
    if (deleteConfirm === id) {
      onDeleteIntervention(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getInterventionIcon = (type: string) => {
    switch (type) {
      case 'injection':
        return <Syringe className="w-5 h-5 text-blue-600" />;
      case 'surgery':
        return <Scissors className="w-5 h-5 text-blue-600" />;
      case 'laser':
        return <Eye className="w-5 h-5 text-blue-600" />;
      default:
        return <FileText className="w-5 h-5 text-blue-600" />;
    }
  };

  const getInterventionTypeLabel = (type: string) => {
    switch (type) {
      case 'injection':
        return 'Inyección';
      case 'surgery':
        return 'Cirugía';
      case 'laser':
        return 'Láser';
      default:
        return 'Otro';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    return timeStr.slice(0, 5);
  };

  // Sort interventions by date (most recent first)
  const sortedInterventions = [...interventions].sort((a, b) => 
    new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Intervenciones</h3>
          <p className="text-sm text-gray-600">
            Historial de inyecciones, cirugías y procedimientos
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Intervención
        </button>
      </div>

      {/* Interventions List */}
      {sortedInterventions.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
          <Syringe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No hay intervenciones registradas
          </h4>
          <p className="text-gray-600 mb-4">
            Agregue la primera intervención para este paciente
          </p>
          <button
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Intervención
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedInterventions.map((intervention) => (
            <div
              key={intervention.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 transition cursor-pointer"
              onClick={() => navigate(`/intervention/${intervention.id}`)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  {getInterventionIcon(intervention.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">
                    {intervention.subtype}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(intervention.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(intervention.time)}
                    </div>
                    <span className="px-2 py-1 bg-white rounded-full text-xs font-medium border">
                      {intervention.eye}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {getInterventionTypeLabel(intervention.type)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {intervention.isCompleted ? (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Completado</span>
                  </div>
                ) : (
                  <div className="flex items-center text-yellow-600">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    <span className="text-xs">Pendiente</span>
                  </div>
                )}
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditIntervention(intervention);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                  title="Editar intervención"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteIntervention(intervention.id!);
                  }}
                  className={`p-2 rounded-full transition-colors ${
                    deleteConfirm === intervention.id
                      ? 'text-red-700 bg-red-100'
                      : 'text-gray-400 hover:text-red-600 hover:bg-red-100'
                  }`}
                  title={deleteConfirm === intervention.id ? 'Confirmar eliminación' : 'Eliminar intervención'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                  {expandedItems.has(intervention.id!) ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Expanded Details Modal/Overlay */}
      {Array.from(expandedItems).map(expandedId => {
        const intervention = sortedInterventions.find(i => i.id === expandedId);
        if (!intervention) return null;

        return (
          <div
            key={expandedId}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4"
            onClick={() => toggleExpanded(expandedId)}
          >
            <div
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-xl">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{intervention.subtype}</h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(intervention.date)} • {formatTime(intervention.time)} • {intervention.eye}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpanded(expandedId)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team and anesthesia info for all types */}
                  {intervention.surgeon && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cirujano</label>
                      <p className="text-sm text-gray-900 mt-1">{intervention.surgeon}</p>
                    </div>
                  )}
                  {intervention.assistantSurgeon && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Cirujano asistente</label>
                      <p className="text-sm text-gray-900 mt-1">{intervention.assistantSurgeon}</p>
                    </div>
                  )}
                  {intervention.anesthesiologist && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Anestesiólogo</label>
                      <p className="text-sm text-gray-900 mt-1">{intervention.anesthesiologist}</p>
                    </div>
                  )}
                  {intervention.instrumentator && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Instrumentador/a</label>
                      <p className="text-sm text-gray-900 mt-1">{intervention.instrumentator}</p>
                    </div>
                  )}
                  {intervention.anesthesiaType && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tipo de anestesia</label>
                      <p className="text-sm text-gray-900 mt-1">{intervention.anesthesiaType}</p>
                    </div>
                  )}
                  {/* Laser-specific field */}
                  {intervention.type === 'laser' && intervention.laserType && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Tipo de láser</label>
                      <p className="text-sm text-gray-900 mt-1">{intervention.laserType}</p>
                    </div>
                  )}

                  {/* Next Follow-up */}
                  {intervention.nextFollowUp && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Próximo seguimiento</label>
                      <p className="text-sm text-gray-900 mt-1">{formatDate(intervention.nextFollowUp)}</p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {intervention.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Notas</label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">{intervention.notes}</p>
                  </div>
                )}

                {/* Outcome */}
                {intervention.outcome && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Resultado</label>
                    <p className="text-sm text-gray-900 mt-1 bg-gray-50 p-3 rounded-md">{intervention.outcome}</p>
                  </div>
                )}

                {/* Complications */}
                {intervention.complications && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Complicaciones</label>
                    <p className="text-sm text-red-700 mt-1 bg-red-50 p-3 rounded-md">{intervention.complications}</p>
                  </div>
                )}

                {/* Attached Files */}
                {intervention.files && intervention.files.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Documentos adjuntos</label>
                    <div className="mt-1 space-y-1">
                      {intervention.files.map((file, index) => (
                        <div key={index} className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
                          <FileText className="w-4 h-4 mr-2" />
                          <span>{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* Upload Modal */}
      {showUpload && (
        <InterventionUpload
          onSave={handleSaveIntervention}
          onCancel={handleCancelUpload}
          initialData={editingIntervention || undefined}
          patientName={patientName}
        />
      )}
    </div>
  );
};

export default InterventionsList; 