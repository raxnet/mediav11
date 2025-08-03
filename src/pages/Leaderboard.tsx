import { useEffect, useState } from "react";

export default function Leaderboard({ locale, translations }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch("/functions/users?leaderboard=1").then(r => r.json()).then(setUsers);
  }, []);
  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-center text-blue-700 dark:text-blue-300">🏆 {translations[locale].leaderboard}</h2>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">#</th>
            <th className="text-left">User</th>
            <th className="text-right">{translations[locale].coins}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, idx) => (
            <tr key={u.id} className={idx === 0 ? "bg-yellow-100 dark:bg-yellow-900" : ""}>
              <td>{idx + 1}</td>
              <td>
                <div className="flex items-center gap-2">
                  <img src={u.avatar || "/default-avatar.png"} className="w-7 h-7 rounded-full border" alt="avatar" />
                  <span className="font-bold">{u.username}</span>
                </div>
              </td>
              <td className="text-right font-bold">{u.coins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}