"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

type Notification = {
  message: string;
  userId: number;
  createdAt?: string;
};

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Listen to backend notifications
    socket.on("admin-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      socket.off("admin-notification");
    };
  }, []);

  return (
    <div className="relative">
      <button className="p-2 rounded-full bg-gray-200">
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>
      {notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-md rounded-md max-h-96 overflow-y-auto">
          {notifications.map((n, i) => (
            <div key={i} className="p-2 border-b">
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
