import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Home from './components/Home';
import MoodLogger from './components/MoodLogger';
import Dashboard from './components/Dashboard';
import AiChat from './components/AiChat';
import Activities from './components/Activities';
import Caregiver from './components/Caregiver';
import Crisis from './components/Crisis';
import Settings from './components/Settings';
import Resources from './components/Resources';
import { getAuthUser, getUser, saveUser, updateStreak, seedDemoData, logoutUser } from './lib/storage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState<any>(null);
  const [authUser, setAuthUser] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuthUser();
    if (auth) {
      setAuthUser(auth);
      seedDemoData();
      const u = updateStreak();
      setUser({ ...u, avatar: auth.avatar, role: auth.role });
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (profile: any) => {
    setAuthUser(profile);
    seedDemoData();
    const u = updateStreak();
    setUser({ ...u, avatar: profile.avatar, role: profile.role });
  };

  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
    setUser(null);
    setCurrentPage('home');
  };

  const handleUserUpdate = (updatedUser: any) => {
    saveUser(updatedUser);
    setUser(updatedUser);
  };

  if (!authChecked) return null;
  if (!authUser) return <Login onLogin={handleLogin} />;

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <Home setCurrentPage={setCurrentPage} user={user} />;
      case 'mood': return <MoodLogger onMoodLogged={() => setCurrentPage('dashboard')} />;
      case 'dashboard': return <Dashboard setCurrentPage={setCurrentPage} />;
      case 'chat': return <AiChat />;
      case 'activities': return <Activities />;
      case 'caregiver': return <Caregiver />;
      case 'crisis': return <Crisis setCurrentPage={setCurrentPage} />;
      case 'resources': return <Resources setCurrentPage={setCurrentPage} />;
      case 'settings': return <Settings setUser={handleUserUpdate} onLogout={handleLogout} />;
      default: return <Home setCurrentPage={setCurrentPage} user={user} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage} user={user}>
      {renderPage()}
    </Layout>
  );
}
