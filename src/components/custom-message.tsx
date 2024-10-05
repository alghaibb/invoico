import clsx from "clsx";
import { AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import React, { ReactNode } from "react";

// Defining type of the message
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

export const Message: React.FC<MessageProps> = ({ type, message }) => {
  const iconSize = 20;

  return (
    <div className={clsx(messageStyles.base, messageStyles[type])}>
      {/* Add icon based on message type */}
      {type === "error" && (
        <AlertCircle size={iconSize} className="text-red-600" />
      )}
      {type === "success" && (
        <CheckCircle size={iconSize} className="text-green-600" />
      )}
      {type === "info" && <Info size={iconSize} className="text-blue-600" />}
      {type === "warning" && (
        <AlertTriangle size={iconSize} className="text-yellow-600" />
      )}

      {/* Display message type label */}
      {type === "error"}
      {type === "success"}
      {type === "info"}
      {type === "warning"}

      {/* Display the message */}
      <span>{message}</span>
    </div>
  );
};
