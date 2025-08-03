import { useEffect, useState } from 'react';
import { fetchAPI } from '../utils/api';

export default function Dashboard({ sessionId, locale, translations }) {
  const [coins, setCoins] = useState(0);
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    fetchAPI('/functions/coins', { action: 'get', sessionId }).then(r => setCoins(r.coins));
    fetchAPI('/functions/tasks', { action: 'mytasks', sessionId }).then(setTasks);
  }, [sessionId]);
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">{translations[locale].dashboard}</h1>
      <div className="mb-4">{translations[locale].coins}: <span className="font-semibold">{coins}</span></div>
      <div>
        <h2 className="text-xl font-semibold mb-2">{translations[locale].tasks}</h2>
        <table className="w-full table-auto border">
          <thead>
            <tr>
              <th>Link</th>
              <th>Judul</th>
              <th>Like Target</th>
              <th>Like Saat Ini</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(t => (
              <tr key={t.id}>
                <td><a href={t.link} target="_blank" rel="noreferrer">{t.link}</a></td>
                <td>{t.title}</td>
                <td>{t.like_target}</td>
                <td>{t.current_like}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}