import { useState } from 'react';
import { fetchAPI } from '../utils/api';

export default function CreateTask({ sessionId, locale, translations }) {
  const [link, setLink] = useState('');
  const [title, setTitle] = useState('');
  const [likeTarget, setLikeTarget] = useState(1);
  const [message, setMessage] = useState('');

  const handleCreate = async () => {
    const res = await fetchAPI('/functions/tasks', {
      action: 'create',
      sessionId,
      task: { link, likeTarget, title }
    });
    if (res.success) setMessage('Tugas berhasil dibuat!');
    else setMessage(res.error || 'Gagal membuat tugas');
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">{translations[locale].create_task}</h2>
      <div className="mb-3">
        <input className="border px-3 py-2 w-full" type="text" placeholder="Judul tugas" value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div className="mb-3">
        <input className="border px-3 py-2 w-full" type="text" placeholder="Link konten" value={link} onChange={e => setLink(e.target.value)} />
      </div>
      <div className="mb-3">
        <input className="border px-3 py-2 w-full" type="number" min={1} placeholder="Target Like" value={likeTarget} onChange={e => setLikeTarget(Number(e.target.value))} />
      </div>
      <button className="btn" onClick={handleCreate}>{translations[locale].save}</button>
      <div className="mt-3 text-red-500">{message}</div>
    </div>
  );
}