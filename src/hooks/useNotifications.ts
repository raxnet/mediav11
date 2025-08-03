import { useState, useEffect } from "react";
import { fetchAPI } from "../utils/api";

export function useNotifications(sessionId) {
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    if (sessionId) {
      const poll = () => {
        fetchAPI("/functions/notifications", { sessionId }).then(setNotifications);
      };
      poll();
      const timer = setInterval(poll, 10000); // polling 10 detik
      return () => clearInterval(timer);
    }
  }, [sessionId]);
  return notifications;
}