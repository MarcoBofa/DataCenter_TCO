"use client";
import React, { createContext, ReactNode, useContext, useState } from "react";
import Ajv, { ErrorObject } from "ajv"; // Import ErrorObject for typing
import { tcoSchema } from "../schemas/schema"; // Import your schema
import addErrors from "ajv-errors"; // If using custom error messages
import {
  Land,
  ServerCluster,
  StorageNode,
  Network,
  PowerDistributionAndCooling,
  EnergyCost,
  Software,
  Labor,
  DataCenter,
  TCOContextValue,
} from "./types";

// Define the result type
interface LoadSchemaResult {
  success: boolean;
  errors?: ErrorObject[];
}

// Create Context
const TCOContext = createContext<TCOContextValue | null>(null);

// Define Provider Props Type
interface TCOProviderProps {
  children: ReactNode;
}

// Define Provider
export const TCOProvider: React.FC<TCOProviderProps> = ({ children }) => {
  const [land, setLand] = useState<Land>({});
  const [serverClusterJson, setServerClusterJson] = useState<ServerCluster[]>(
    []
  );
  const [storageNode, setStorageNode] = useState<StorageNode[]>([]);
  const [network, setNetwork] = useState<Network>({});
  const [powerDistributionAndCooling, setPowerDistributionAndCooling] =
    useState<PowerDistributionAndCooling>({});
  const [energyCost, setEnergyCost] = useState<EnergyCost>({});
  const [software, setSoftware] = useState<Software>({});
  const [labor, setLabor] = useState<Labor>({});

  // Initialize AJV for validation
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addErrors(ajv); // Enhance Ajv with custom error messages
  const validate = ajv.compile(tcoSchema);

  // Function to Load and Validate Entire Schema
  const loadSchema = (data: Partial<DataCenter>): LoadSchemaResult => {
    const valid = validate({ datacenter: data });

    console.log("DATA : ", data);
    if (!valid) {
      console.error(validate.errors);
      return { success: false, errors: validate.errors ?? undefined };
    }

    setLand(data.land || {});
    setServerClusterJson(data.serverClusterJson || []);
    setStorageNode(data.storageNode || []);
    setNetwork(data.network || {});
    setPowerDistributionAndCooling(data.powerDistributionAndCooling || {});
    setEnergyCost(data.energyCost || {});
    setSoftware(data.software || {});
    setLabor(data.labor || {});
    return { success: true };
  };

  return (
    <TCOContext.Provider
      value={{
        land,
        serverClusterJson,
        storageNode,
        network,
        powerDistributionAndCooling,
        energyCost,
        software,
        labor,
        setLand,
        setServerClusterJson,
        setStorageNode,
        setNetwork,
        setPowerDistributionAndCooling,
        setEnergyCost,
        setSoftware,
        setLabor,
        loadSchema,
      }}
    >
      {children}
    </TCOContext.Provider>
  );
};

// Custom Hook to Use Context
export const useTCO = (): TCOContextValue => {
  const context = useContext(TCOContext);
  if (!context) {
    throw new Error("useTCO must be used within a TCOProvider");
  }
  return context;
};
