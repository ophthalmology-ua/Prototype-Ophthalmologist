import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientProfile from './pages/PatientProfile';
import UploadStudy from './pages/UploadStudy';
import Consultation from './pages/Consultation';
import Appointments from './pages/Appointments';
import Reports from './pages/Reports';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <Router basename="/Lab-3-Prototype">
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<PatientList />} />
          <Route path="patients/:id" element={<PatientProfile />} />
          <Route path="upload" element={<UploadStudy />} />
          <Route path="consultation/:id" element={<Consultation />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
