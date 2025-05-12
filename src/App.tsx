import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientProfile from './pages/PatientProfile';
import UploadStudy from './pages/UploadStudy';
import Consultation from './pages/Consultation';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import MainLayout from './layouts/MainLayout';
import { LanguageProvider } from './contexts/LanguageContext';
import Login from './pages/Login';
import DiagnosisDetail from './pages/DiagnosisDetail';
import RecordDetail from './pages/RecordDetail';

function App() {
  return (
    <LanguageProvider>
      <Router basename="/Prototype-Ophthalmologist">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="patients" element={<PatientList />} />
            <Route path="patientInfo/:id" element={<PatientProfile />} />
            <Route path="upload" element={<UploadStudy />} />
            <Route path="consultation/:id" element={<Consultation />} />
            <Route path="appointments" element={<Appointments />} />
            <Route path="reports" element={<Reports />} />
            <Route path="diagnosis/:id" element={<DiagnosisDetail />} />
            <Route path="records/:id" element={<RecordDetail />} />
          </Route>
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
