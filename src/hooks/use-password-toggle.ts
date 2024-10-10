"use client";

import { useState, ReactNode } from "react";


// Custom hook for toggling visibility of a password field
export const usePasswordToggle = ({
  visibleIcon = "EyeOff", // Default icon for visible state
  hiddenIcon = "Eye", // Default icon for hidden state
}: {
  visibleIcon?: ReactNode; // Accept ReactNode, allowing both strings and JSX elements
  hiddenIcon?: ReactNode;
} = {}) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  return {
    visible,
    toggleVisibility,
    inputType: visible ? "text" : "password", // returns input type based on visibility
    icon: visible ? visibleIcon : hiddenIcon, // returns the appropriate icon based on visibility
  };
};
