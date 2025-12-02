"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Bell } from "lucide-react";
import { fetchNotifications } from "@/services/adminServices";

type Notification = {
  id: number;
  message: string;
  userId: number;
  isRead: boolean;
  createdAt?: string;
};

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("admin-notification", (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleNotifications = async () => {
    if (!open) {
      // Fetch notifications when opening
      const res = await fetchNotifications();
      setNotifications(res);

      // Optionally, mark all notifications as unread = false
      await markNotificationsUnread();
    }
    setOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <Bell
        size={24}
        className="cursor-pointer text-gray-700"
        onClick={handleNotifications}
      />
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          {notifications.length}
        </span>
      )}

      {open && notifications.length > 0 && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-md rounded-md max-h-96 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-2 border-b ${!n.isRead ? "bg-gray-100" : ""}`}
            >
              {n.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
