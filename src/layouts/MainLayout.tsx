import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  ClipboardList,
  Settings
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { useState } from 'react';

const MainLayout = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActiveRoute = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const navigation = [
    { name: t('dashboard'), path: '/', icon: LayoutDashboard },
    { name: t('patients'), path: '/patients', icon: Users },
    { name: t('appointments'), path: '/appointments', icon: Calendar }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar (desktop) */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:w-64 md:block bg-white shadow-lg z-30">
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">OphthalCMS</h1>
            </div>
          </div>
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActiveRoute(item.path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-600 hover:bg-blue-50/50 hover:text-blue-600'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${
                    isActiveRoute(item.path)
                      ? 'text-blue-600'
                      : 'text-gray-400 group-hover:text-blue-600'
                  }`} />
                  <span className="ml-3 font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>
          {/* User Profile Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <span className="text-white font-medium">DS</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Dr. Smith</p>
                <p className="text-xs text-gray-500">{t('doctor')}</p>
              </div>
              <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile top nav */}
      <header className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between h-16 px-4">
        <button onClick={() => setMobileMenuOpen(true)} className="p-2 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-50 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800">OphthalCMS</h2>
        <LanguageSwitcher />
      </header>
      {/* Mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-30" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-64 bg-white shadow-lg h-full flex flex-col">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center space-x-3">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">OphthalCMS</h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActiveRoute(item.path)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-blue-50/50 hover:text-blue-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${
                      isActiveRoute(item.path)
                        ? 'text-blue-600'
                        : 'text-gray-400 group-hover:text-blue-600'
                    }`} />
                    <span className="ml-3 font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                  <span className="text-white font-medium">DS</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Dr. Smith</p>
                  <p className="text-xs text-gray-500">{t('doctor')}</p>
                </div>
                <button className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Page Content */}
        <main className="flex-1 p-2 sm:p-6 w-full max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 
// This is the main layout for the application. It is used to wrap the main content of the application.
// It includes a sidebar for navigation, a top navigation bar, and a main content area.
// The sidebar is hidden on desktop and shown on mobile.
// The top navigation bar is hidden on mobile and shown on desktop.
// The main content area is the main content of the page.
// The main content area is the main content of the page.
