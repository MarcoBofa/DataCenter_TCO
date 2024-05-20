"use client";

import { Toaster } from "react-hot-toast";

const ToasterProvider = () => {
  return (
    <Toaster
      containerStyle={{}}
      toastOptions={{
        success: {
          style: {
            fontSize: "1.1rem",
          },
        },
        error: {
          style: {
            fontSize: "1.1rem",
          },
        },
      }}
    />
  );
};

export default ToasterProvider;
