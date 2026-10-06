import { useState } from 'react';
import { Home, Smile, BarChart2, MessageCircle, Wind, Users, Settings, Menu, X, Bell, Heart, BookOpen } from 'lucide-react';

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'mood', icon: Smile, label: 'Log Mood' },
  { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
  { id: 'chat', icon: MessageCircle, label: 'AI Companion' },
  { id: 'activities', icon: Wind, label: 'Calm Activities' },
  { id: 'resources', icon: BookOpen, label: 'Resources & Experts' },
  { id: 'caregiver', icon: Users, label: 'Caregiver View' },
];

const pageTitles: Record<string, { title: string; sub: string }> = {
  home: { title: 'Welcome Back', sub: 'How are you feeling today?' },
  mood: { title: 'Log Your Mood', sub: "Express what you're feeling right now" },
  dashboard: { title: 'Mood Dashboard', sub: 'Your trends & emotional insights' },
  chat: { title: 'AI Companion', sub: '24/7 compassionate support' },
  activities: { title: 'Calm Activities', sub: 'Breathe, meditate & find your peace' },
  resources: { title: 'Resources & Experts', sub: 'Expert-verified articles · Find therapists near you' },
  caregiver: { title: 'Caregiver View', sub: 'Monitor and support emotional well-being' },
  settings: { title: 'Settings', sub: 'Customize your experience' },
  crisis: { title: 'Crisis Support', sub: 'You are not alone — help is here' },
};

export default function Layout({ currentPage, setCurrentPage, user, children }: any) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const current = pageTitles[currentPage] || pageTitles.home;

  const SidebarContent = () => (
    <>
      <div style={{ padding: '22px 20px 18px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, flexShrink: 0, background: 'linear-gradient(135deg, #2a9990, #4ecdc4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: '0 4px 16px rgba(78,205,196,0.3)' }}>🧠</div>
          <div>
            <div style={{ fontSize: '1.08rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--txt)' }}>
              Mind<span style={{ color: 'var(--teal)' }}>Bridge</span><span style={{ color: 'var(--sage)' }}>+</span>
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--txt3)', letterSpacing: '0.12em', marginTop: 2, fontWeight: 600, textTransform: 'uppercase' }}>
              Mental Wellness AI
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: 'rgba(78,205,196,0.07)', border: '1px solid var(--border)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--teal-dim), var(--sage-dim))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{user?.avatar || '😊'}</div>
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--txt)' }}>{user?.name || 'Friend'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--sand)', display: 'flex', alignItems: 'center', gap: 4 }}>
              🔥 {user?.streak || 0} day streak
            </div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="section-title" style={{ padding: '8px 6px 4px', marginBottom: 6 }}>Main Menu</div>
        {navItems.map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => { setCurrentPage(id); setMobileOpen(false); }} className={`nav-btn ${currentPage === id ? 'active' : ''}`}>
            <Icon size={16} style={{ flexShrink: 0 }} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div style={{ padding: '10px 10px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={() => { setCurrentPage('settings'); setMobileOpen(false); }} className={`nav-btn ${currentPage === 'settings' ? 'active' : ''}`}>
          <Settings size={15} /> Settings
        </button>
        <button
          onClick={() => { setCurrentPage('crisis'); setMobileOpen(false); }}
          style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 14px', borderRadius: 12, border: '1.5px solid rgba(255,107,107,0.25)', background: 'rgba(255,107,107,0.07)', color: 'var(--crimson)', fontSize: '0.87rem', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%', transition: 'all 0.18s' }}
        >
          <Heart size={15} /> Crisis Support
        </button>
      </div>
    </>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <div className="orb" style={{ width: 600, height: 600, background: '#4ecdc4', top: -200, left: -100, animationDuration: '26s' }} />
      <div className="orb" style={{ width: 500, height: 500, background: '#f7c59f', bottom: -150, right: -100, animationDuration: '30s', animationDelay: '-10s' }} />
      <div className="orb" style={{ width: 350, height: 350, background: '#a8e6cf', top: '40%', left: '45%', animationDuration: '34s', animationDelay: '-17s' }} />

      <aside style={{ width: 256, flexShrink: 0, background: 'rgba(12, 28, 26, 0.97)', backdropFilter: 'blur(30px)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto', zIndex: 50 }} className="hidden-mobile">
        <SidebarContent />
      </aside>

      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}
      <aside style={{ width: 256, background: 'rgba(12, 28, 26, 0.99)', backdropFilter: 'blur(30px)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', overflowY: 'auto', zIndex: 60, transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }} className="show-mobile">
        <SidebarContent />
      </aside>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', minWidth: 0 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', height: 64, flexShrink: 0, background: 'rgba(10, 24, 22, 0.85)', backdropFilter: 'blur(24px)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{ width: 38, height: 38, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--txt2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
            <div>
              <h1 style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--txt)', lineHeight: 1.2 }}>{current.title}</h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--txt3)', marginTop: 1 }}>{current.sub}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '5px 12px', borderRadius: 20, background: 'rgba(247,197,159,0.1)', border: '1px solid rgba(247,197,159,0.2)', fontSize: '0.73rem', color: 'var(--sand)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
              🔥 {user?.streak || 0} days
            </div>
            <button style={{ width: 36, height: 36, borderRadius: 10, border: '1px solid var(--border)', background: 'transparent', color: 'var(--txt2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Bell size={16} />
              <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, borderRadius: '50%', background: 'var(--crimson)', border: '1.5px solid var(--bg-mid)' }} />
            </button>
          </div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: '28px 32px 60px', minWidth: 0 }}>
          <div style={{ maxWidth: 1040, margin: '0 auto', width: '100%' }} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
