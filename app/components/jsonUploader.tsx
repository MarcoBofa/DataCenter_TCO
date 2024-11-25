// components/JsonUploader.tsx
"use client";
import React, { useRef, useState } from "react";
import { useTCO } from "../context/useContext";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const JsonUploader: React.FC = () => {
  const { loadSchema } = useTCO();
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (
      file &&
      (file.type === "application/json" || file.name.endsWith(".json"))
    ) {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const json = JSON.parse(e.target?.result as string);

          const result = loadSchema(json.datacenter);
          if (result.success) {
            setErrorMessage("");
          } else {
            const errorMessages = result.errors
              ?.map((err) => `${err.instancePath} ${err.message}`)
              .join("\n");
            setErrorMessage(`Invalid data format:\n${errorMessages}`);
          }
        } catch (err) {
          console.error("Error parsing JSON file:", err);
          setErrorMessage("Error parsing JSON file");
        }
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      };
      reader.readAsText(file);
    } else {
      setErrorMessage("Please upload a valid JSON file.");
    }
  };

  return (
    <div className="rounded-full bg-gray-200 p-[5px] sm:p-3 hover:scale-110 hover:border transition-all">
      <FontAwesomeIcon
        onClick={handleButtonClick}
        className="text-gray-700  hover:text-blue-800 text-lg sm:text-2xl cursor-pointer "
        icon={faUpload}
      />
      <input
        type="file"
        accept=".json,application/json"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />
      {errorMessage && (
        <pre className="text-red-500 mt-2 whitespace-pre-wrap">
          {errorMessage}
        </pre>
      )}
    </div>
  );
};

export default JsonUploader;
