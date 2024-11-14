// src/constants/salaries.ts

export const SALARIES = {
  MANAGEMENT: {
    DATA_CENTER_MANAGER: "180,720 US$",
    OPERATIONS_MANAGER: "162,240 US$",
    DIRECTOR_OF_INFRASTRUCTURE: "162,240 US$",
    IT_DIRECTOR: "162,240 US$",
    TECHNICAL_DIRECTOR: "162,240 US$",
    DIRECTOR_OF_OPERATION: "162,240 US$",
    POWER_SYSTEM_MANAGER: "125,900 US$",
    COOLING_SYSTEM_MANAGER: "125,900 US$",
    INFRASTRUCTURE_MANAGER: "125,900 US$",
    IT_HARDWARE_MANAGER: "147,770 US$",
    IT_SOFTWARE_MANAGER: "147,770 US$",
    PROJECT_MANAGER: "96,059 US$",
  },
  ENGINEERING: {
    POWER_SYSTEM_ARCHITECT: "145,317 US$",
    POWER_SYSTEM_ENGINEER: "120,249 US$",
    ELECTRICAL_ENGINEERS: "117,680 US$",
    MECHANICAL_ENGINEERS: "105,220 US$",
    COOLING_SYSTEM_ENGINEER: "120,249 US$",
    FLUID_MECHANICS_ENGINEER: "116,805 US$",
    COMPUTER_HARDWARE_ENGINEER: "130,007 US$",
    NETWORK_ENGINEER: "133,930 US$",
    SOFTWARE_ENGINEER: "138,110 US$",
    CLOUD_ENGINEERS: "115,280 US$",
    NETWORK_SECURITY_ENGINEER: "124,948 US$",
    THERMAL_ENGINEER: "123,213 US$",
  },
  TECHNICIANS: {
    ELECTRO_MECHANICAL_TECHNICIAN: "72,430 US$",
    MAINTENANCE_ELECTRICIAN: "49,650 US$",
    CONTROL_SYSTEMS_TECHNICIAN: "72,372 US$",
    CHILLER_SYSTEMS_OPERATOR: "52,067 US$",
    ENVIRONMENTAL_CONTROL_TECHNICIAN: "62,900 US$",
    HARDWARE_MAINTENANCE_TECHNICIAN: "74,312 US$",
  },
  SUPPORT: {
    MAINTENANCE_WORKERS: "49,650 US$",
    SECURITY_GUARD: "40,440 US$",
    SUSTAINABILITY_ANALYST: "83,242 US$",
    INTEGRATION_SPECIALIST: "92,314 US$",
  },
  ADMINISTRATION: {
    ACCOUNTANT: "74,240 US$",
    RISK_MANAGER: "128,358 US$",
    SYSTEMS_ADMINISTRATORS: "100,580 US$",
    HR_MANAGER: "154,740 US$",
    TALENT_ACQUISITION_SPECIALIST: "69,396 US$",
    FINANCE_MANAGER: "132,473 US$",
    COMPLIANCE_SPECIALIST: "80,190 US$",
    LEGAL_COUNSEL: "184,606 US$",
    SURVEILLANCE_OPERATOR: "42,460 US$",
    CONTRACT_MANAGER: "105,036 US$",
    CUSTODIAL_STAFF: "36,250 US$",
  },
  ARCHITECTURE: {
    HARDWARE_ARCHITECT: "133,930 US$",
    SOFTWARE_ARCHITECT: "133,930 US$",
  },
  IT_STACK: {
    COMPUTATIONAL_SCIENTIST: "108,335 US$",
    HPC_ENGINEER: "155,880 US$",
    DISASTER_RECOVERY_SPECIALIST: "91,394 US$",
    DATABASE_ADMINISTRATORS: "104,810 US$",
    CYBERSECURITY_ANALYST: "124,740 US$",
  },
};

export type Role =
  | keyof (typeof SALARIES)["MANAGEMENT"]
  | keyof (typeof SALARIES)["ENGINEERING"]
  | keyof (typeof SALARIES)["TECHNICIANS"]
  | keyof (typeof SALARIES)["SUPPORT"]
  | keyof (typeof SALARIES)["ADMINISTRATION"]
  | keyof (typeof SALARIES)["ARCHITECTURE"]
  | keyof (typeof SALARIES)["IT_STACK"];

export const ADDITIONAL_COST_PERCENTAGES: { [key in Role]: number } = {
  DATA_CENTER_MANAGER: 0.35,
  OPERATIONS_MANAGER: 0.3,
  DIRECTOR_OF_INFRASTRUCTURE: 0.3,
  IT_DIRECTOR: 0.3,
  TECHNICAL_DIRECTOR: 0.3,
  DIRECTOR_OF_OPERATION: 0.3,
  POWER_SYSTEM_MANAGER: 0.25,
  COOLING_SYSTEM_MANAGER: 0.25,
  INFRASTRUCTURE_MANAGER: 0.25,
  IT_HARDWARE_MANAGER: 0.3,
  IT_SOFTWARE_MANAGER: 0.3,
  POWER_SYSTEM_ARCHITECT: 0.25,
  POWER_SYSTEM_ENGINEER: 0.25,
  ELECTRICAL_ENGINEERS: 0.25,
  MECHANICAL_ENGINEERS: 0.25,
  COOLING_SYSTEM_ENGINEER: 0.25,
  FLUID_MECHANICS_ENGINEER: 0.25,
  COMPUTER_HARDWARE_ENGINEER: 0.25,
  NETWORK_ENGINEER: 0.28,
  SOFTWARE_ENGINEER: 0.28,
  CLOUD_ENGINEERS: 0.28,
  NETWORK_SECURITY_ENGINEER: 0.28,
  THERMAL_ENGINEER: 0.24,
  ELECTRO_MECHANICAL_TECHNICIAN: 0.15,
  MAINTENANCE_ELECTRICIAN: 0.15,
  CONTROL_SYSTEMS_TECHNICIAN: 0.15,
  CHILLER_SYSTEMS_OPERATOR: 0.15,
  ENVIRONMENTAL_CONTROL_TECHNICIAN: 0.15,
  HARDWARE_MAINTENANCE_TECHNICIAN: 0.15,
  MAINTENANCE_WORKERS: 0.1,
  SECURITY_GUARD: 0.1,
  SUSTAINABILITY_ANALYST: 0.2,
  INTEGRATION_SPECIALIST: 0.2,
  ACCOUNTANT: 0.15,
  RISK_MANAGER: 0.25,
  SYSTEMS_ADMINISTRATORS: 0.2,
  DATABASE_ADMINISTRATORS: 0.2,
  HR_MANAGER: 0.3,
  TALENT_ACQUISITION_SPECIALIST: 0.15,
  FINANCE_MANAGER: 0.25,
  COMPLIANCE_SPECIALIST: 0.15,
  LEGAL_COUNSEL: 0.35,
  SURVEILLANCE_OPERATOR: 0.15,
  CONTRACT_MANAGER: 0.2,
  CUSTODIAL_STAFF: 0.1,
  HARDWARE_ARCHITECT: 0.28,
  SOFTWARE_ARCHITECT: 0.28,
  COMPUTATIONAL_SCIENTIST: 0.25,
  HPC_ENGINEER: 0.29,
  DISASTER_RECOVERY_SPECIALIST: 0.21,
  CYBERSECURITY_ANALYST: 0.25,
  PROJECT_MANAGER: 0.27,
};

// Constants needed for your component

// Cost constants
export const COSTS = {
  COST_CORE: 120,
  COST_GB_MEM: 10,
  COST_RACK: 1700,
  COST_CHASSIS_U: 400,
  COST_CHASSIS_U_LIQUID: 400,
  COST_CHASSIS_2U: 1000,
  COST_CHASSIS_2U_LIQUID: 1500,
  COST_MOTHERBOARD_SINGLE: 600,
  COST_MOTHERBOARD_DUAL: 950,
  ETHERNET_NICS: 110,
  LOW_SSD: 0.1,
  MID_SSD: 0.3,
  HIGH_SSD: 0.55,
  LOW_HDD: 0.015,
  HIGH_HDD: 0.25,
  EXTRA_COST_PER_NODE: 50,
};

// Power consumption constants
export const POWER_CONSUMPTION = {
  MOTHERBOARD_CONSUMPTION: 60,
  RAM_CONSUMPTION: 24,
  STORAGE_CONSUMPTION: 5,
  PSU_800W: 800,
};

// GPU costs
export const GPU_COSTS = {
  H100: 30000,
  A100_40: 8000,
  A100_80: 13000,
  A40: 6000,
  A30: 5000,
  L4: 2500,
  T4: 1000,
  V100: 3000,
  NVLINK_SWITCH: 1.3,
};

// CPU power consumption
export const CPU_POWER_CONSUMPTION = {
  INTEL_MAX: 350,
  INTEL_PLAT: 331,
  INTEL_GOLD: 234,
  INTEL_SIL: 145,
  AMD_BERGAMO: 335,
  AMD_SIENA: 150,
  AMD_GENOAX: 340,
  AMD_GENOA: 300,
};

// CPU cost per core based on CPU type
export const CPU_COST_PER_CORE = {
  INTEL_MAX: 226,
  INTEL_PLAT: 151,
  INTEL_GOLD: 115,
  INTEL_SILVER: 54,
  AMD_BERGAMO: 131,
  AMD_SIENA: 57,
  AMD_GENOAX: 175,
  AMD_GENOA: 118,
};

// Discount tiers based on node count
export const DISCOUNTS = [
  { minNodes: 50, maxNodes: 100, discountRate: 0.9 },
  { minNodes: 101, maxNodes: 300, discountRate: 0.85 },
  { minNodes: 301, maxNodes: 500, discountRate: 0.8 },
  { minNodes: 501, maxNodes: 5000, discountRate: 0.75 },
  { minNodes: 5001, maxNodes: Infinity, discountRate: 0.6 },
];

export const MTTF_VALUES = {
  // MTTF values in hours for CPUs
  INTEL_MAX: 200000,
  INTEL_PLAT: 220000,
  INTEL_GOLD: 250000,
  INTEL_SILVER: 260000,
  AMD_BERGAMO: 240000,
  AMD_SIENA: 250000,
  AMD_GENOAX: 230000,
  AMD_GENOA: 240000,

  // MTTF values in hours for GPUs
  H100: 300000,
  A100_40: 300000,
  A100_80: 300000,
  A40: 240000,
  A30: 230000,
  T4: 250000,
  L4: 250000,
  V100: 200000,

  // Default values
  DEFAULT_CPU: 200000,
  DEFAULT_GPU: 150000,
};
