import clsx from "clsx";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import React, { ReactNode } from "react";

type MessageType = "error" | "success" | "info" | "warning";

interface MessageProps {
  type: MessageType;
  message: ReactNode;
}

const messageStyles = {
  base: "p-4 mb-4 text-sm rounded-lg flex items-center gap-2",
  error: "text-red-600 bg-red-50 border border-red-400",
  success: "text-green-600 bg-green-50 border border-green-400",
  info: "text-blue-800 bg-blue-50 border border-blue-400",
  warning: "text-yellow-600 bg-yellow-50 border border-yellow-400",
};

const iconMap = {
  error: AlertCircle,
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
};

export const Message: React.FC<MessageProps> = ({ type, message }) => {
  const Icon = iconMap[type];

  return (
    <div
      className={clsx(
        messageStyles.base,
        messageStyles[type],
        "flex items-center flex-col md:flex-row"
      )}
    >
      <Icon size={20} className={`text-${messageStyles[type].split(" ")[0]}`} />
      <span className="ml-2">{message}</span>
    </div>
  );
};
