import { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import UserManagement from './UserManagement';
import AppointmentManagement from './AppointmentManagement';
import ContentManagement from './ContentManagement';
import Reports from './Reports';
import Settings from './Settings';

interface AdminDashboardProps {
  onLogout: () => void;
}

export type PageType = 'dashboard' | 'users' | 'appointments' | 'content' | 'reports' | 'settings';

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'users':
        return <UserManagement />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'content':
        return <ContentManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onLogout={onLogout}
      />
      <div className="flex-1 lg:ml-64">
        {renderPage()}
      </div>
    </div>
  );
}
