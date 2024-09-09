import React from "react";

interface FormHeaderProps {
  label: string;
  title: string;
}

const FormHeader = ({ label, title }: FormHeaderProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full gap-y-4">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};

export default FormHeader;
