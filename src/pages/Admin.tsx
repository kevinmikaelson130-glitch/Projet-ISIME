import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, MessageSquare, LogOut, Menu, X, 
  FileText, ChevronRight, Home, Newspaper
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { AdminApplications } from '@/components/admin/AdminApplications';
import { AdminMessages } from '@/components/admin/AdminMessages';
import { AdminNews } from '@/components/admin/AdminNews';
import isimeLogo from '@/assets/isime-logo.jpeg';

type Tab = 'applications' | 'messages' | 'news';

const Admin = () => {
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('applications');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const tabs = [
    { id: 'applications' as Tab, label: 'Candidatures', icon: FileText },
    { id: 'messages' as Tab, label: 'Messages', icon: MessageSquare },
    { id: 'news' as Tab, label: 'Actualités', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-card border-r border-border flex flex-col fixed h-full z-40"
      >
        {/* Logo */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={isimeLogo} 
              alt="ISIME" 
              className="w-10 h-10 rounded-lg object-cover"
            />
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-lg"
              >
                Admin ISIME
              </motion.span>
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <tab.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1 text-left">{tab.label}</span>
                      {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border space-y-2">
          <a
            href="/"
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <Home className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Retour au site</span>}
          </a>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-destructive/10 text-destructive transition-all ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span>Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main 
        className="flex-1 transition-all duration-300"
        style={{ marginLeft: sidebarOpen ? 280 : 80 }}
      >
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {activeTab === 'applications' ? 'Candidatures' : activeTab === 'messages' ? 'Messages' : 'Actualités'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {activeTab === 'applications' 
                  ? 'Gérez les demandes de candidature' 
                  : activeTab === 'messages' ? 'Répondez aux messages des visiteurs' : 'Publiez les nouvelles du site'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-sm">{user.email}</p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'applications' && <AdminApplications />}
          {activeTab === 'messages' && <AdminMessages />}
          {activeTab === 'news' && <AdminNews />}
        </div>
      </main>
    </div>
  );
};

export default Admin;
