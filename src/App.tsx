import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import GemstoneDetailPage from './pages/GemstoneDetailPage';
import GemstoneFormPage from './pages/GemstoneFormPage';
import ReportsPage from './pages/ReportsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import NotFoundPage from './pages/NotFoundPage';
import QrCodePage from './pages/QrCodePage';
import LoginPage from './pages/LoginPage';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="inventory" element={<InventoryPage />} />
        <Route path="gemstone/:id" element={<GemstoneDetailPage />} />
        <Route path="gemstone/new" element={<GemstoneFormPage />} />
        <Route path="gemstone/:id/edit" element={<GemstoneFormPage />} />
        <Route path="gemstone/:id/qr" element={<QrCodePage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;