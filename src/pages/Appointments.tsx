import { useState, useEffect } from 'react';
import { Calendar, Plus, Search, Clock, User, Phone, CheckCircle, XCircle, RotateCcw, UserX, MoreVertical, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import BookingModal from '../components/BookingModal';

// Define appointment status type
type AppointmentStatus = 'booked' | 'confirmed' | 'waitingRoom' | 'inProgress' | 'completed' | 'cancelled' | 'rescheduled' | 'noShow';

// Interface for appointment data
interface Appointment {
  id: number;
  patientName: string;
  patientPhone?: string;
  date: string;
  time: string;
  doctor: string;
  specialty: string;
  status: AppointmentStatus;
  selectedChecklistItems: string[];
  linkedChecklistItemId?: string; // Link to a specific checklist item
}

// Mock appointments data with simplified structure
const mockAppointments: Appointment[] = [
  {
    id: 1,
    patientName: 'John Doe',
    patientPhone: '+1 (555) 123-4567',
    date: '2024-04-20',
    time: '09:00',
    doctor: 'Dr. Sarah Smith',
    specialty: 'General Ophthalmology',
    status: 'confirmed',
    selectedChecklistItems: ['eye-exam', 'vision-test'],
    linkedChecklistItemId: 'checklist-001'
  },
  {
    id: 2,
    patientName: 'Jane Smith',
    patientPhone: '+1 (555) 987-6543',
    date: '2024-04-20',
    time: '09:30',
    doctor: 'Dr. Michael Johnson',
    specialty: 'Retina Specialist',
    status: 'waitingRoom',
    selectedChecklistItems: ['retina-photo', 'pressure-test'],
    linkedChecklistItemId: 'checklist-002'
  },
  {
    id: 3,
    patientName: 'Robert Johnson',
    patientPhone: '+1 (555) 456-7890',
    date: '2024-04-20',
    time: '10:00',
    doctor: 'Dr. Emily Williams',
    specialty: 'Cornea Specialist',
    status: 'inProgress',
    selectedChecklistItems: ['dilation', 'visual-field']
  },
  {
    id: 4,
    patientName: 'Maria Garcia',
    patientPhone: '+1 (555) 234-5678',
    date: '2024-04-20',
    time: '10:30',
    doctor: 'Dr. David Brown',
    specialty: 'Glaucoma Specialist',
    status: 'completed',
    selectedChecklistItems: ['pressure-test', 'visual-field']
  },
  {
    id: 5,
    patientName: 'David Wilson',
    patientPhone: '+1 (555) 345-6789',
    date: '2024-04-20',
    time: '11:00',
    doctor: 'Dr. Sarah Smith',
    specialty: 'General Ophthalmology',
    status: 'booked',
    selectedChecklistItems: ['eye-exam']
  },
  {
    id: 6,
    patientName: 'Sarah Brown',
    patientPhone: '+1 (555) 567-8901',
    date: '2024-04-20',
    time: '11:30',
    doctor: 'Dr. Michael Johnson',
    specialty: 'Retina Specialist',
    status: 'cancelled',
    selectedChecklistItems: ['retina-photo']
  },
  {
    id: 7,
    patientName: 'Michael Davis',
    patientPhone: '+1 (555) 678-9012',
    date: '2024-04-20',
    time: '14:00',
    doctor: 'Dr. Emily Williams',
    specialty: 'Cornea Specialist',
    status: 'noShow',
    selectedChecklistItems: ['eye-exam', 'dilation']
  },
  {
    id: 8,
    patientName: 'Lisa Anderson',
    patientPhone: '+1 (555) 789-0123',
    date: '2024-04-20',
    time: '14:30',
    doctor: 'Dr. David Brown',
    specialty: 'Glaucoma Specialist',
    status: 'rescheduled',
    selectedChecklistItems: ['pressure-test']
  },
];

const Appointments = () => {
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState('2024-04-20');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    appointmentId: number;
    action: string;
    newStatus: AppointmentStatus;
  } | null>(null);
  const [unmarkChecklistItem, setUnmarkChecklistItem] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openDropdown]);

  // Filter appointments based on date, status, and search term
  const filteredAppointments = appointments.filter(appointment => {
    const matchesDate = appointment.date === selectedDate;
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesStatus && matchesSearch;
  });

  // Get status badge styling
  const getStatusBadge = (status: AppointmentStatus) => {
    const statusConfig = {
      booked: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      confirmed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      waitingRoom: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      inProgress: { color: 'bg-purple-100 text-purple-800', icon: User },
      completed: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
      cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
      rescheduled: { color: 'bg-orange-100 text-orange-800', icon: RotateCcw },
      noShow: { color: 'bg-gray-100 text-gray-800', icon: UserX },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {t(status)}
      </span>
    );
  };



  // Handle status change with confirmation
  const handleStatusChange = (appointmentId: number, action: string, newStatus: AppointmentStatus) => {
    setPendingAction({ appointmentId, action, newStatus });
    setShowConfirmDialog(true);
  };

  // Confirm status change
  const confirmStatusChange = () => {
    if (pendingAction) {
      setAppointments(prev => 
        prev.map(apt => 
          apt.id === pendingAction.appointmentId 
            ? { ...apt, status: pendingAction.newStatus }
            : apt
        )
      );
      
      // Handle checklist item unmarking if requested
      if (unmarkChecklistItem && pendingAction) {
        const appointment = appointments.find(a => a.id === pendingAction.appointmentId);
        if (appointment?.linkedChecklistItemId) {
          console.log(`Unmarking checklist item: ${appointment.linkedChecklistItemId}`);
          // Here you would typically call a function to update the checklist item status
          // For now, we'll just log it. In a real implementation, you'd:
          // 1. Find the checklist item by ID
          // 2. Update its status to 'pending' or 'overdue' depending on the context
          // 3. Trigger a re-render of the checklist component
        }
      }
      
      // Show success message (you could implement a toast notification here)
      console.log(t(`appointment${pendingAction.action.charAt(0).toUpperCase() + pendingAction.action.slice(1)}`));
    }
    
    setShowConfirmDialog(false);
    setPendingAction(null);
    setUnmarkChecklistItem(false);
  };

  // Get available actions based on current status
  const getAvailableActions = (status: AppointmentStatus) => {
    const actions = [];
    
    switch (status) {
      case 'booked':
        actions.push(
          { label: t('confirmAppointment'), action: 'confirmed', newStatus: 'confirmed' as AppointmentStatus },
          { label: t('cancelAppointment'), action: 'cancelled', newStatus: 'cancelled' as AppointmentStatus }
        );
        break;
      case 'confirmed':
        actions.push(
          { label: t('checkInPatient'), action: 'checkedIn', newStatus: 'waitingRoom' as AppointmentStatus },
          { label: t('rescheduleAppointment'), action: 'rescheduled', newStatus: 'rescheduled' as AppointmentStatus },
          { label: t('cancelAppointment'), action: 'cancelled', newStatus: 'cancelled' as AppointmentStatus }
        );
        break;
      case 'waitingRoom':
        actions.push(
          { label: t('markAsCompleted'), action: 'completed', newStatus: 'inProgress' as AppointmentStatus },
          { label: t('markAsNoShow'), action: 'markedNoShow', newStatus: 'noShow' as AppointmentStatus }
        );
        break;
      case 'inProgress':
        actions.push(
          { label: t('markAsCompleted'), action: 'completed', newStatus: 'completed' as AppointmentStatus }
        );
        break;
      default:
        // No actions available for completed, cancelled, rescheduled, noShow
        break;
    }
    
    return actions;
  };

  // Handle new appointment booking
  const handleNewBooking = (bookingData: any) => {
    // Map doctor ID to doctor name for display
    const doctorMapping: Record<string, string> = {
      'dr-smith': 'Dr. Sarah Smith',
      'dr-johnson': 'Dr. Michael Johnson',
      'dr-williams': 'Dr. Emily Williams',
      'dr-brown': 'Dr. David Brown'
    };
    
    const newAppointment: Appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      patientName: bookingData.patientName,
      patientPhone: bookingData.patientPhone,
      date: bookingData.date,
      time: bookingData.time,
      doctor: doctorMapping[bookingData.doctor] || bookingData.doctor,
      specialty: bookingData.specialty,
      status: 'booked',
      selectedChecklistItems: bookingData.selectedChecklistItems || []
    };

    setAppointments(prev => [...prev, newAppointment]);
    
    // Show success notification
    setSuccessMessage(t('appointmentBooked'));
    setShowSuccessNotification(true);
    
    // Auto-hide notification after 5 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 5000);
  };

  // Confirmation Dialog Component
  const ConfirmDialog = () => {
    const currentAppointment = pendingAction ? appointments.find(a => a.id === pendingAction.appointmentId) : null;
    const shouldShowUnmarkOption = currentAppointment?.linkedChecklistItemId && 
      (pendingAction?.newStatus === 'cancelled' || pendingAction?.newStatus === 'noShow');
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{t('confirmAction')}</h3>
          <p className="text-gray-600 mb-1">{t('areYouSure')}</p>
          <p className="text-sm text-gray-500 mb-4">{t('thisActionCannotBeUndone')}</p>
          
          {shouldShowUnmarkOption && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={unmarkChecklistItem}
                  onChange={(e) => setUnmarkChecklistItem(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-blue-800">
                  También desmarcar el elemento de la lista de verificación vinculado
                </span>
              </label>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowConfirmDialog(false);
                setUnmarkChecklistItem(false);
              }}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t('cancel')}
            </button>
            <button
              onClick={confirmStatusChange}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('confirmAction')}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{t('appointments')}</h1>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <button 
          onClick={() => setShowBookingModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('scheduleAppointment')}
        </button>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchAppointments')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">{t('allAppointments')}</option>
            <option value="booked">{t('booked')}</option>
            <option value="confirmed">{t('confirmed')}</option>
            <option value="waitingRoom">{t('waitingRoom')}</option>
            <option value="inProgress">{t('inProgress')}</option>
            <option value="completed">{t('completed')}</option>
            <option value="cancelled">{t('cancelled')}</option>
            <option value="rescheduled">{t('rescheduled')}</option>
            <option value="noShow">{t('noShow')}</option>
          </select>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center">
          <Calendar className="w-5 h-5 text-gray-400 mr-2" />
          <input
            type="date"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <span className="ml-4 text-sm text-gray-600">
            {filteredAppointments.length} {t('appointments').toLowerCase()}
          </span>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('patient')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('time')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('doctor')}
                </th>

                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => {
                const availableActions = getAvailableActions(appointment.status);
                
                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium">
                            {appointment.patientName.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientName}
                        </div>
                        <div className="text-sm text-gray-500">
                            {appointment.patientPhone && (
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                {appointment.patientPhone}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <Clock className="w-4 h-4 text-gray-400 mr-1" />
                        {appointment.time}
                    </div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{appointment.doctor}</div>
                  </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(appointment.status)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {availableActions.length > 0 ? (
                        <div className="flex justify-end space-x-2">
                          {availableActions.length <= 2 ? (
                            // Show all actions as buttons when 2 or fewer
                            availableActions.map((action, index) => (
                              <button
                                key={index}
                                onClick={() => handleStatusChange(appointment.id, action.action, action.newStatus)}
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                              >
                                {action.label}
                              </button>
                            ))
                          ) : (
                            // Show primary action + dropdown for 3+ actions
                            <>
                              <button
                                onClick={() => handleStatusChange(appointment.id, availableActions[0].action, availableActions[0].newStatus)}
                                className="text-blue-600 hover:text-blue-900 text-xs px-2 py-1 border border-blue-200 rounded hover:bg-blue-50 transition-colors"
                              >
                                {availableActions[0].label}
                              </button>
                                                            <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setOpenDropdown(openDropdown === appointment.id ? null : appointment.id);
                                  }}
                                  className="text-gray-600 hover:text-gray-900 text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors flex items-center"
                                >
                                  <MoreVertical className="w-3 h-3" />
                    </button>
                                {openDropdown === appointment.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    {availableActions.slice(1).map((action, index) => (
                                      <button
                                        key={index}
                                        onClick={() => {
                                          handleStatusChange(appointment.id, action.action, action.newStatus);
                                          setOpenDropdown(null);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                      >
                                        {action.label}
                    </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No actions</span>
                      )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No appointments found for the selected filters.</p>
          </div>
        )}
      </div>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 animate-in slide-in-from-right-2">
          <CheckCircle className="w-5 h-5" />
          <span>{successMessage}</span>
          <button
            onClick={() => setShowSuccessNotification(false)}
            className="ml-4 text-green-100 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Modals */}
      <BookingModal 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onBooking={handleNewBooking}
        prefillData={{ dueDate: selectedDate }}
        existingAppointments={appointments.map(apt => ({
          date: apt.date,
          time: apt.time,
          patientName: apt.patientName
        }))}
      />
      {showConfirmDialog && <ConfirmDialog />}
    </div>
  );
};

export default Appointments; 