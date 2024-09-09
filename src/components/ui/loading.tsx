import React from "react";

export const LoadingDots: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes bouncing-loader {
            to {
              opacity: 0.1;
              transform: translateY(-6px);
            }
          }
        `}
      </style>
      <div style={bouncingLoaderStyle}>
        <div style={{ ...dotStyle, animationDelay: "0ms" }}></div>
        <div style={{ ...dotStyle, animationDelay: "200ms" }}></div>
        <div style={{ ...dotStyle, animationDelay: "400ms" }}></div>
      </div>
    </>
  );
};

// Inline styles
const bouncingLoaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const dotStyle: React.CSSProperties = {
  width: "6px",
  height: "6px",
  margin: "3px 6px",
  borderRadius: "50%",
  backgroundColor: "#a3a1a1",
  opacity: 1,
  animation: "bouncing-loader 0.6s infinite alternate",
};
