import { useEffect, useState } from 'react';
import { fetchAPI } from '../utils/api';
import TaskCard from '../components/TaskCard';

export default function Tasks({ sessionId, locale, translations }) {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  useEffect(() => {
    fetchAPI('/functions/tasks', { action: 'list', sessionId }).then(setTasks);
  }, [sessionId]);

  const onSubmit = async (taskId) => {
    const res = await fetchAPI('/functions/tasks', { action: 'submit', sessionId, taskId });
    if (res.success && res.link) window.open(res.link, '_blank');
    fetchAPI('/functions/tasks', { action: 'list', sessionId }).then(setTasks);
  };

  const filtered = tasks.filter(t => t.title?.toLowerCase().includes(search.toLowerCase()) || t.link?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">{translations[locale].tasks}</h1>
      <input className="border px-3 py-2 mb-4 w-full" type="text" placeholder={translations[locale].search} value={search} onChange={e => setSearch(e.target.value)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => <TaskCard key={t.id} task={t} onSubmit={onSubmit} />)}
      </div>
    </div>
  );
}