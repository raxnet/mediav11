import { useState, useEffect } from 'react';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Leaderboard from './pages/Leaderboard';
import CreateTask from './pages/CreateTask';
import Navbar from './components/Navbar';
import ProfileModal from './components/ProfileModal';
import { fetchAPI } from './utils/api';
import { translations } from './i18n';
import { useDarkMode } from './hooks/useDarkMode';
import { useNotifications } from './hooks/useNotifications';

export default function App() {
  const [sessionId, setSessionId] = useState('');
  const [user, setUser] = useState({});
  const [tab, setTab] = useState('dashboard');
  const [locale, setLocale] = useState('id');
  const [dark, setDark] = useDarkMode();
  const notifications = useNotifications(sessionId);
  const [profileOpen, setProfileOpen] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (sessionId) {
      fetchAPI('/functions/auth', { action: 'getUser', sessionId }).then(setUser);
    }
  }, [sessionId]);

  const login = async () => {
    const res = await fetchAPI('/functions/auth', { action: 'login', username, password });
    if (res.sessionId) setSessionId(res.sessionId);
    else setError(res.error || 'Login gagal');
  };

  const register = async () => {
    const res = await fetchAPI('/functions/auth', { action: 'register', username, password });
    if (res.success) login();
    else setError(res.error || 'Register gagal');
  };

  const logout = () => {
    setSessionId('');
    setUser({});
    setUsername('');
    setPassword('');
    setTab('dashboard');
  };

  const saveProfile = async ({ avatar, bio }) => {
    await fetchAPI('/functions/auth', { action: 'editProfile', sessionId, avatar, bio });
    fetchAPI('/functions/auth', { action: 'getUser', sessionId }).then(setUser);
  };

  if (!sessionId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="p-8 rounded-lg shadow-lg bg-white dark:bg-gray-800 w-96">
          <h1 className="text-3xl font-bold mb-4 text-center text-blue-700 dark:text-blue-400">raxnet</h1>
          <input className="border px-3 py-2 w-full mb-2" type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="border px-3 py-2 w-full mb-2" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="btn w-full mb-2" onClick={login}>{translations[locale].login}</button>
          <button className="btn w-full" onClick={register}>{translations[locale].register}</button>
          {error && <div className="mt-2 text-red-500">{error}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar
        user={user}
        onLogout={logout}
        dark={dark}
        toggleDark={() => setDark(!dark)}
        locale={locale}
        setLocale={setLocale}
        notifications={notifications}
        onOpenProfile={() => setProfileOpen(true)}
      />
      <nav className="bg-white dark:bg-gray-800 shadow px-8 py-4 flex gap-4">
        <button className={tab === 'dashboard' ? 'font-bold' : ''} onClick={() => setTab('dashboard')}>{translations[locale].dashboard}</button>
        <button className={tab === 'tasks' ? 'font-bold' : ''} onClick={() => setTab('tasks')}>{translations[locale].tasks}</button>
        <button className={tab === 'leaderboard' ? 'font-bold' : ''} onClick={() => setTab('leaderboard')}>{translations[locale].leaderboard}</button>
        <button className={tab === 'create' ? 'font-bold' : ''} onClick={() => setTab('create')}>{translations[locale].create_task}</button>
      </nav>
      <main>
        {tab === 'dashboard' && <Dashboard sessionId={sessionId} locale={locale} translations={translations} />}
        {tab === 'tasks' && <Tasks sessionId={sessionId} locale={locale} translations={translations} />}
        {tab === 'leaderboard' && <Leaderboard locale={locale} translations={translations} />}
        {tab === 'create' && <CreateTask sessionId={sessionId} locale={locale} translations={translations} />}
      </main>
      <ProfileModal open={profileOpen} setOpen={setProfileOpen} user={user} onSave={saveProfile} />
    </div>
  );
}