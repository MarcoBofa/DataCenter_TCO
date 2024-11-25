import { ErrorObject } from "ajv";

export interface Land {
  ft?: number;
  occupancy?: number;
  powerRating?: number;
  rentalRate?: number;
  cap?: number;
}

export interface ServerCluster {
  mode?: "custom" | "guided";
  cpu?: string;
  homeNodeCount?: number;
  processorsPerNode?: number;
  coresPerProcessor?: number;
  ramPerNode?: number;
  storagePerNode?: number;
  typeOfSSD?: "high" | "low" | "mid";
  gpu?: string;
  gpu_perNode?: number;
  gpu_model?: string;
  custom_cost_per_node?: number;
  custom_core_per_node?: number;
}

export interface StorageNode {
  mode?: "custom" | "guided";
  type?: "sata" | "nvme" | "hdd" | "tape";
  amount?: number;
  price?: number;
}

export interface Network {
  provider?: "infiniband" | "slingshot";
  tier?: number;
  bandwidth?: number;
  topology?: "dragonfly" | "fat-tree" | "leaf-spine";
}

export interface PowerDistributionAndCooling {
  pue?: number;
  cooling?: "liquid" | "air";
}

export interface EnergyCost {
  eCost?: number;
  choice?: "yes" | "no";
  usage?: number;
}

export interface Software {
  os?: "suse" | "rh_vm" | "rh_physical" | "custom";
  priceLicense?: number;
}

export interface Worker {
  role?: string;
  count?: number;
}

export interface Labor {
  mode?: "guided" | "custom";
  workers?: Worker[];
}

// Combine All Parts into a DataCenter Interface
export interface DataCenter {
  land: Land;
  serverClusterJson: ServerCluster[];
  storageNode: StorageNode[];
  network: Network;
  powerDistributionAndCooling: PowerDistributionAndCooling;
  energyCost: EnergyCost;
  software: Software;
  labor: Labor;
}

export interface TCOContextValue {
  land: Land;
  serverClusterJson: ServerCluster[];
  storageNode: StorageNode[];
  network: Network;
  powerDistributionAndCooling: PowerDistributionAndCooling;
  energyCost: EnergyCost;
  software: Software;
  labor: Labor;
  setLand: React.Dispatch<React.SetStateAction<Land>>;
  setServerClusterJson: React.Dispatch<React.SetStateAction<ServerCluster[]>>;
  setStorageNode: React.Dispatch<React.SetStateAction<StorageNode[]>>;
  setNetwork: React.Dispatch<React.SetStateAction<Network>>;
  setPowerDistributionAndCooling: React.Dispatch<
    React.SetStateAction<PowerDistributionAndCooling>
  >;
  setEnergyCost: React.Dispatch<React.SetStateAction<EnergyCost>>;
  setSoftware: React.Dispatch<React.SetStateAction<Software>>;
  setLabor: React.Dispatch<React.SetStateAction<Labor>>;
  loadSchema: (data: Partial<DataCenter>) => {
    success: boolean;
    errors?: ErrorObject[];
  };
}
