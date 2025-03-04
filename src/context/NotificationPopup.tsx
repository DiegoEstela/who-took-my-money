import { createContext, useState, ReactNode } from "react";
import NotificationPopup from "../components/NotificationPopup";

type NotificationType = "success" | "error" | "warning";

interface NotificationContextProps {
  showNotification: (type: NotificationType, text: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextProps | undefined
>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<{
    type: NotificationType;
    text: string;
  } | null>(null);

  const showNotification = (type: NotificationType, text: string) => {
    setNotification({ type, text });

    setTimeout(() => {
      setNotification(null);
    }, 4000); // Se oculta después de 4 segundos
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <NotificationPopup type={notification.type} text={notification.text} />
      )}
    </NotificationContext.Provider>
  );
};
