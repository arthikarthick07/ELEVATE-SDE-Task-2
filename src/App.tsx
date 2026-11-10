import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout';
import AdminLayout from '@/components/AdminLayout';
import Home from '@/pages/Home';
import Request from '@/pages/Request';
import Track from '@/pages/Track';
import Verify from '@/pages/Verify';
import AdminLogin from '@/pages/AdminLogin';
import AdminApplications from '@/pages/AdminApplications';
import AdminCertificates from '@/pages/AdminCertificates';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/request" element={<Request />} />
            <Route path="/track" element={<Track />} />
            <Route path="/verify" element={<Verify />} />
          </Route>

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/applications" replace />} />
            <Route path="applications" element={<AdminApplications />} />
            <Route path="certificates" element={<AdminCertificates />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
