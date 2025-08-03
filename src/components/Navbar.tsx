import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BellIcon, SunIcon, MoonIcon, MenuIcon, UserCircleIcon } from "@heroicons/react/outline";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar({
  user,
  onLogout,
  dark,
  toggleDark,
  locale,
  setLocale,
  notifications,
  onOpenProfile,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 shadow px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
            <MenuIcon className="w-7 h-7 text-white" />
          </button>
          <img src="/logo.svg" alt="raxnet" className="h-8 hidden md:inline" />
          <span className="font-bold text-2xl text-white">raxnet</span>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={toggleDark}>
            {dark ? <SunIcon className="w-6 h-6 text-yellow-300" /> : <MoonIcon className="w-6 h-6 text-white" />}
          </button>
          <NotificationBell notifications={notifications} />
          <LanguageSwitcher locale={locale} setLocale={setLocale} />
          <button className="flex items-center gap-2" onClick={onOpenProfile}>
            <UserCircleIcon className="w-7 h-7 text-white" />
            <span className="font-semibold text-white">{user.username}</span>
          </button>
          <button className="btn ml-2" onClick={onLogout}>Logout</button>
        </div>
      </nav>
      <Transition show={sidebarOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-40" onClose={setSidebarOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="fixed inset-y-0 left-0 bg-white dark:bg-gray-900 w-64 p-8 flex flex-col gap-4">
              <span className="font-bold text-xl text-blue-700 dark:text-blue-400">raxnet</span>
              <button onClick={() => setSidebarOpen(false)} className="self-end mb-4">
                <MenuIcon className="w-7 h-7" />
              </button>
              <nav className="flex flex-col gap-2">
                <a href="#" className="font-semibold text-blue-600 dark:text-blue-300">Dashboard</a>
                <a href="#" className="font-semibold text-blue-600 dark:text-blue-300">Tasks</a>
                <a href="#" className="font-semibold text-blue-600 dark:text-blue-300">Leaderboard</a>
                <a href="#" className="font-semibold text-blue-600 dark:text-blue-300">Create Task</a>
              </nav>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
function NotificationBell({ notifications }) {
  return (
    <div className="relative">
      <BellIcon className="w-7 h-7 text-white" />
      {notifications.length > 0 && (
        <span className="absolute -top-1 -right-2 bg-red-500 text-white rounded-full text-xs px-2">{notifications.length}</span>
      )}
    </div>
  );
}