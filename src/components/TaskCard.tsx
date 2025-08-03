import { ArrowUpRightIcon, LightningBoltIcon, CheckBadgeIcon } from "@heroicons/react/outline";
export default function TaskCard({ task, onSubmit }) {
  const progress = Math.round((task.current_like / task.like_target) * 100);
  return (
    <div className="bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-700 dark:to-blue-900 rounded-xl shadow-lg p-6 flex flex-col gap-2 hover:scale-[1.01] transition transform duration-150">
      <div className="flex items-center gap-2 mb-2">
        <img src={task.avatar || "/default-avatar.png"} className="w-8 h-8 rounded-full border" alt="avatar" />
        <span className="font-semibold text-lg">{task.title || task.link}</span>
        {task.status === "closed" && (
          <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 rounded text-xs flex items-center gap-1">
            <CheckBadgeIcon className="w-4 h-4" /> Selesai
          </span>
        )}
        {progress >= 80 && (
          <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs flex items-center gap-1 animate-pulse">
            <LightningBoltIcon className="w-4 h-4" /> Trending
          </span>
        )}
      </div>
      <a href={task.link} target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-300 flex items-center gap-1 hover:underline">
        {task.link}
        <ArrowUpRightIcon className="w-4 h-4" />
      </a>
      <div className="flex items-center gap-3 mt-2">
        <span className="font-bold">{task.current_like}/{task.like_target}</span>
        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded overflow-hidden">
          <div className="bg-blue-600 h-2 rounded transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        {task.status === "open" && (
          <button className="btn" onClick={() => onSubmit(task.id)}>
            Selesaikan & Dapat Koin
          </button>
        )}
      </div>
    </div>
  );
}