import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";

export default function ProfileModal({ open, setOpen, user, onSave }) {
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [bio, setBio] = useState(user.bio || "");
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={setOpen}>
        <Dialog.Overlay className="fixed inset-0 bg-black/40" />
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-96 flex flex-col gap-4">
            <h2 className="font-bold text-xl mb-2 text-blue-700 dark:text-blue-300">Edit Profile</h2>
            <div className="flex flex-col items-center gap-2">
              <img src={avatar || "/default-avatar.png"} className="w-20 h-20 rounded-full border-2" alt="avatar" />
              <input
                type="text"
                className="border px-3 py-2 w-full"
                placeholder="URL avatar"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
              />
            </div>
            <textarea
              className="border px-3 py-2 w-full mt-2"
              placeholder="Bio, tentang kamu"
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
            <button
              className="btn mt-2"
              onClick={() => {
                onSave({ avatar, bio });
                setOpen(false);
              }}
            >
              Simpan
            </button>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}