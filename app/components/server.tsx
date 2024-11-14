"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

// Importing constants
import {
  COSTS,
  POWER_CONSUMPTION,
  GPU_COSTS,
  CPU_POWER_CONSUMPTION,
  CPU_COST_PER_CORE,
  DISCOUNTS,
  MTTF_VALUES, // New import for MTTF values
} from "../constants/costants"; // Adjust the path as necessary

interface localProps {
  mode: string;
  cpu: string;
  homeNodeCount: number;
  processorsPerNode: number;
  coresPerProcessor: number;
  ramPerNode: number;
  storagePerNode: number;
  typeOfSSD: string;
  gpu: string;
  gpu_perNode: number;
  gpu_model: string;
  custom_cost_per_node: number;
  custom_core_per_node: number;
}

interface ServerProps {
  index: string;
  nodeCount: number;
  updateServerCluster: (index: string, totalCost: number) => void;
  updateServerNodeCluster: (index: string, nodeCount: number) => void;
  updateServerNodeConsumption: (
    index: string,
    serverConsumption: number
  ) => void;
  updateServerCoreNumber: (index: string, coreNumber: number) => void;
  updateServerGpuNumber: (index: string, GpuNode: number) => void;
}

const Server: React.FC<ServerProps> = ({
  index,
  nodeCount,
  updateServerCluster,
  updateServerNodeCluster,
  updateServerNodeConsumption,
  updateServerCoreNumber,
  updateServerGpuNumber,
}) => {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useForm<localProps>({
    defaultValues: {
      mode: "Guided",
      cpu: "intel_gold",
      homeNodeCount: nodeCount,
      processorsPerNode: 1,
      coresPerProcessor: 8,
      ramPerNode: 4,
      storagePerNode: 64,
      typeOfSSD: "high_ssd",
      gpu: "No",
      gpu_perNode: 1,
      gpu_model: "H100",
      custom_cost_per_node: 1,
      custom_core_per_node: 1,
    },
  });

  const [totalClusterCost, setTotalClusterCost] = useState(0);
  const [totalClusterCore, setTotalClusterCore] = useState(1);

  const mode = useWatch({ control, name: "mode" });
  const homeNodeCount = useWatch({ control, name: "homeNodeCount" });
  const processorsPerNode = useWatch({ control, name: "processorsPerNode" });
  const coresPerProcessor = useWatch({ control, name: "coresPerProcessor" });
  const ramPerNode = useWatch({ control, name: "ramPerNode" });
  const storagePerNode = useWatch({ control, name: "storagePerNode" });
  const typeOfSSD = useWatch({ control, name: "typeOfSSD" });
  const gpu = useWatch({ control, name: "gpu" });
  const cpu = useWatch({ control, name: "cpu" });
  const gpu_perNode = useWatch({ control, name: "gpu_perNode" });
  const gpu_model = useWatch({ control, name: "gpu_model" });
  const custom_cost_per_node = useWatch({
    control,
    name: "custom_cost_per_node",
  });
  const custom_core_per_node = useWatch({
    control,
    name: "custom_core_per_node",
  });

  const totalCores = useMemo(
    () => homeNodeCount * processorsPerNode * coresPerProcessor,
    [homeNodeCount, processorsPerNode, coresPerProcessor]
  );
  const totalRam = useMemo(
    () => homeNodeCount * ramPerNode,
    [homeNodeCount, ramPerNode]
  );
  const totalStorage = useMemo(
    () => homeNodeCount * storagePerNode,
    [homeNodeCount, storagePerNode]
  );

  // Mappings
  const cpuCostPerCoreMapping: { [key: string]: number } = {
    intel_max: CPU_COST_PER_CORE.INTEL_MAX,
    intel_plat: CPU_COST_PER_CORE.INTEL_PLAT,
    intel_gold: CPU_COST_PER_CORE.INTEL_GOLD,
    intel_sil: CPU_COST_PER_CORE.INTEL_SILVER,
    amd_bergamo: CPU_COST_PER_CORE.AMD_BERGAMO,
    amd_siena: CPU_COST_PER_CORE.AMD_SIENA,
    amd_genoax: CPU_COST_PER_CORE.AMD_GENOAX,
    amd_genoa: CPU_COST_PER_CORE.AMD_GENOA,
  };

  const cpuPowerConsumptionMapping: { [key: string]: number } = {
    intel_max: CPU_POWER_CONSUMPTION.INTEL_MAX,
    intel_plat: CPU_POWER_CONSUMPTION.INTEL_PLAT,
    intel_gold: CPU_POWER_CONSUMPTION.INTEL_GOLD,
    intel_sil: CPU_POWER_CONSUMPTION.INTEL_SIL,
    amd_bergamo: CPU_POWER_CONSUMPTION.AMD_BERGAMO,
    amd_siena: CPU_POWER_CONSUMPTION.AMD_SIENA,
    amd_genoax: CPU_POWER_CONSUMPTION.AMD_GENOAX,
    amd_genoa: CPU_POWER_CONSUMPTION.AMD_GENOA,
  };

  const gpuCostMapping: { [key: string]: number } = {
    H100: GPU_COSTS.H100,
    A100_40: GPU_COSTS.A100_40,
    A100_80: GPU_COSTS.A100_80,
    A40: GPU_COSTS.A40,
    A30: GPU_COSTS.A30,
    L4: GPU_COSTS.L4,
    T4: GPU_COSTS.T4,
    V100: GPU_COSTS.V100,
  };

  const gpuPowerConsumptionMapping: { [key: string]: number } = {
    H100: 700 * GPU_COSTS.NVLINK_SWITCH,
    A100_40: 350 * GPU_COSTS.NVLINK_SWITCH,
    A100_80: 400 * GPU_COSTS.NVLINK_SWITCH,
    A40: 185 * GPU_COSTS.NVLINK_SWITCH,
    A30: 165 * GPU_COSTS.NVLINK_SWITCH,
    L4: 75 * GPU_COSTS.NVLINK_SWITCH,
    T4: 70 * GPU_COSTS.NVLINK_SWITCH,
    V100: 250 * GPU_COSTS.NVLINK_SWITCH,
  };

  // MTTF mappings (in hours)
  const cpuMttfMapping: { [key: string]: number } = {
    intel_max: MTTF_VALUES.INTEL_MAX,
    intel_plat: MTTF_VALUES.INTEL_PLAT,
    intel_gold: MTTF_VALUES.INTEL_GOLD,
    intel_sil: MTTF_VALUES.INTEL_SILVER,
    amd_bergamo: MTTF_VALUES.AMD_BERGAMO,
    amd_siena: MTTF_VALUES.AMD_SIENA,
    amd_genoax: MTTF_VALUES.AMD_GENOAX,
    amd_genoa: MTTF_VALUES.AMD_GENOA,
  };

  const gpuMttfMapping: { [key: string]: number } = {
    H100: MTTF_VALUES.H100,
    A100_40: MTTF_VALUES.A100_40,
    A100_80: MTTF_VALUES.A100_80,
    A40: MTTF_VALUES.A40,
    A30: MTTF_VALUES.A30,
    T4: MTTF_VALUES.T4,
    V100: MTTF_VALUES.V100,
  };

  const calcPowerRating = () => {
    let p = 0;

    p +=
      POWER_CONSUMPTION.MOTHERBOARD_CONSUMPTION * homeNodeCount +
      Math.ceil(totalRam / 256) * POWER_CONSUMPTION.RAM_CONSUMPTION +
      Math.ceil(totalStorage / 1000) * POWER_CONSUMPTION.STORAGE_CONSUMPTION +
      POWER_CONSUMPTION.PSU_800W * 0.04 * homeNodeCount * 2;

    const cpuPower = cpuPowerConsumptionMapping[cpu] || 0;
    p += cpuPower * homeNodeCount * processorsPerNode;

    if (gpu === "Yes") {
      const gpuPower = gpuPowerConsumptionMapping[gpu_model] || 0;
      p += gpuPower * homeNodeCount * gpu_perNode;

      if (gpu_perNode > 6) {
        p += POWER_CONSUMPTION.PSU_800W * 0.04 * homeNodeCount * 4;
      } else if (gpu_perNode > 4) {
        p += POWER_CONSUMPTION.PSU_800W * 0.04 * homeNodeCount * 3;
      } else if (gpu_perNode > 2) {
        p += POWER_CONSUMPTION.PSU_800W * 0.04 * homeNodeCount * 2;
      } else {
        p += POWER_CONSUMPTION.PSU_800W * 0.04 * homeNodeCount;
      }
    }

    return p;
  };

  // Dt function calculates the reliability at time t
  const Dt = (mttf: number, t: number): number => {
    return Math.exp(-t / mttf);
  };

  // Cs function calculates the number of spares required at time tau
  const Cs = (nc: number, tau: number, mttf: number): number => {
    return nc * (1 / Dt(mttf, tau) - 1);
  };

  // cumulative_Cs function calculates the cumulative number of spares over k intervals
  const cumulative_Cs = (
    nc: number,
    mttf: number,
    k: number,
    tau: number
  ): number => {
    let c_sum = 0;
    for (let i = 1; i <= k - 1; i++) {
      const dt = Dt(mttf, i * tau);
      c_sum +=
        (Cs(nc, (k - i) * tau, mttf) - Cs(nc, (k - i - 1) * tau, mttf)) / dt;
    }
    return (
      c_sum +
      Cs(nc, tau, mttf) / Dt(mttf, (k - 1) * tau) +
      (nc - Cs(nc, (k - 1) * tau, mttf)) / Dt(mttf, k * tau) -
      nc
    );
  };

  // calc_spare_comp function calculates the total number of spares needed
  const calc_spare_comp = (type: string): number => {
    const tau = 0.5; // Base time interval in years
    const k = 4; // Number of intervals (e.g., 5 years)
    const hours_per_year = 24 * 365; // 8760 hours in a year
    let gpuSpares = 0;
    let cpuSpares = 0;

    if (type === "cpu") {
      // Calculate CPU spares
      const totalCpuCount = homeNodeCount * processorsPerNode;
      const cpuMttfHours = cpuMttfMapping[cpu] || MTTF_VALUES.DEFAULT_CPU;
      const cpuMttfYears = cpuMttfHours / hours_per_year;
      cpuSpares = cumulative_Cs(totalCpuCount, cpuMttfYears, k, tau);
      return cpuSpares;
    } else if (type === "gpu") {
      // Calculate GPU spares
      const totalGpuCount = homeNodeCount * gpu_perNode;
      const gpuMttfHours = gpuMttfMapping[gpu_model] || MTTF_VALUES.DEFAULT_GPU;
      const gpuMttfYears = gpuMttfHours / hours_per_year;
      gpuSpares = cumulative_Cs(totalGpuCount, gpuMttfYears, k, tau);
      return gpuSpares;
    }

    return 0;
  };

  const inputCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof localProps,
    min: number
  ) => {
    const value = Number(event.target.value);
    setValue(field, value < min ? min : value, { shouldValidate: true });
  };

  useEffect(() => {
    let totalCost = 0;
    let serverConsumption = 0;

    if (mode === "Guided") {
      const cost_core = cpuCostPerCoreMapping[cpu] || COSTS.COST_CORE;

      const costCores = totalCores * cost_core;
      const costRam = totalRam * COSTS.COST_GB_MEM;

      let costStoragePerGB = COSTS.HIGH_SSD;
      if (typeOfSSD === "mid_ssd") {
        costStoragePerGB = COSTS.MID_SSD;
      } else if (typeOfSSD === "low_ssd") {
        costStoragePerGB = COSTS.LOW_SSD;
      }

      const costStorage = totalStorage * costStoragePerGB;

      let costGpu = 0;
      if (gpu === "Yes") {
        costGpu = gpuCostMapping[gpu_model] || 0;
      }

      let costMotherBoard = COSTS.COST_MOTHERBOARD_SINGLE;
      let costChassis = COSTS.COST_CHASSIS_U;

      if (processorsPerNode == 2) {
        costMotherBoard = COSTS.COST_MOTHERBOARD_DUAL;
        costChassis = COSTS.COST_CHASSIS_2U;
      }

      serverConsumption = calcPowerRating();

      const rackNum = Math.ceil(((homeNodeCount * 2) / 42) * 0.85);
      const rackCost = rackNum * COSTS.COST_RACK;

      // Calculate spare component cost
      let spare_component_cost = 0;

      const CPUsparesNeeded = calc_spare_comp("cpu");
      spare_component_cost = CPUsparesNeeded * cost_core * coresPerProcessor;

      const GPUsparesNeeded = gpu === "Yes" ? calc_spare_comp("gpu") : 0;
      spare_component_cost +=
        GPUsparesNeeded * (gpuCostMapping[gpu_model] || 0);

      // console.log(
      //   "SPARE COMP CPU NUM: ",
      //   CPUsparesNeeded,
      //   "SPARE COMP GPU NUM: ",
      //   GPUsparesNeeded
      // );

      totalCost =
        COSTS.EXTRA_COST_PER_NODE * homeNodeCount +
        COSTS.ETHERNET_NICS * homeNodeCount +
        costMotherBoard * homeNodeCount +
        costChassis * homeNodeCount +
        rackCost +
        costCores +
        costRam +
        costGpu * homeNodeCount * gpu_perNode +
        costStorage +
        spare_component_cost;

      if (gpu === "Yes" && gpu_perNode > 4) {
        totalCost += costChassis * homeNodeCount * 2;
      } else {
        totalCost += costChassis * homeNodeCount;
      }

      // Apply discounts
      for (const discount of DISCOUNTS) {
        if (
          homeNodeCount >= discount.minNodes &&
          homeNodeCount <= discount.maxNodes
        ) {
          totalCost *= discount.discountRate;
          break;
        }
      }
    } else {
      totalCost = custom_cost_per_node * homeNodeCount;
      serverConsumption = 500 * homeNodeCount;
      setTotalClusterCore(custom_core_per_node * homeNodeCount);
    }

    if (gpu === "Yes") {
      updateServerGpuNumber(index, gpu_perNode);
    } else {
      updateServerGpuNumber(index, 0);
    }
    updateServerNodeConsumption(index, serverConsumption);
    setTotalClusterCost(totalCost);
    updateServerCluster(index, totalCost);
    updateServerNodeCluster(index, homeNodeCount);
    updateServerCoreNumber(index, totalCores);
  }, [
    homeNodeCount,
    processorsPerNode,
    coresPerProcessor,
    ramPerNode,
    storagePerNode,
    typeOfSSD,
    gpu,
    gpu_model,
    gpu_perNode,
    cpu,
    totalCores,
    totalRam,
    totalStorage,
    updateServerCluster,
    updateServerNodeCluster,
    updateServerNodeConsumption,
    index,
    updateServerCoreNumber,
    updateServerGpuNumber,
    mode,
    custom_cost_per_node,
    custom_core_per_node,
  ]);

  return (
    <>
      {mode === "Guided" && (
        <div className="flex flex-col space-y-3">
          <div className="flex flex-wrap items-center w-full">
            <select
              {...register("mode")}
              className="w-full sm:w-[200px] p-2 rounded border-gray border-2 mb-3 sm:mb-5 2xl:mb-2 sm:mr-[45px]"
              id="mode"
            >
              <option value="Guided">Guided</option>
              <option value="Customizable">Customizable</option>
            </select>
            <select
              {...register("cpu")}
              className="w-full sm:w-[200px] p-2 rounded border-gray border-2 mb-3 sm:mb-5 2xl:mb-2 sm:mr-[50px]"
            >
              <option value="intel_max">Intel Xeon Max Series</option>
              <option value="intel_plat">Intel Xeon Platinum</option>
              <option value="intel_gold">Intel Xeon Gold</option>
              <option value="intel_sil">Intel Xeon Silver</option>
              <option value="amd_genoa">AMD EPYC Genoa</option>
              <option value="amd_genoax">AMD EPYC Genoa-X</option>
              <option value="amd_siena">AMD EPYC Siena</option>
              <option value="amd_bergamo">AMD EPYC Bergamo</option>
            </select>
            <div className="flex flex-wrap justify-center items-center flex-grow xs:w-auto">
              <div className="w-full sm:w-[285px] border-green-500 bg-green-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
                Total Cores: {totalCores}
              </div>
              <div className="w-full sm:w-[285px] border-sky-500 bg-sky-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
                Total Mem: {totalRam} GB
              </div>
              <div className="w-full sm:w-[285px] border-red-500 border-2 bg-red-100 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
                Total Storage: {totalStorage} GB
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center w-full ">
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="homeNodeCount">
                Number of Nodes
              </label>
              <input
                {...register("homeNodeCount", {
                  valueAsNumber: true,
                  validate: (value) =>
                    value >= 0 || "Nodes must be more than 0",
                })}
                className={`flex-grow p-2 rounded border-2  ${
                  errors.homeNodeCount ? "border-red-500" : "border-gray-200"
                }`}
                id="homeNodeCount"
                type="number"
                placeholder="1"
                min="1"
                onChange={(event) => inputCheck(event, "homeNodeCount", 0)}
              />
              {errors.homeNodeCount && (
                <span className="font-bold text-red-500">
                  {" "}
                  {errors.homeNodeCount.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="processorsPerNode">
                Processors Per Node
              </label>
              <select
                {...register("processorsPerNode", { valueAsNumber: true })}
                className="flex-grow p-2 rounded border-2"
                id="processorsPerNode"
              >
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="coresPerProcessor">
                Cores per Processors
              </label>
              <select
                {...register("coresPerProcessor", { valueAsNumber: true })}
                className="flex-grow p-2 rounded border-2"
                id="coresPerProcessor"
              >
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="12">12</option>
                <option value="16">16</option>
                <option value="24">24</option>
                <option value="28">28</option>
                <option value="32">32</option>
                <option value="36">36</option>
                <option value="42">42</option>
                <option value="48">48</option>
                <option value="52">52</option>
                <option value="56">56</option>
                <option value="60">60</option>
                <option value="64">64</option>
                <option value="84">84</option>
                <option value="96">96</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="ramPerNode">
                Ram per Node
              </label>
              <select
                {...register("ramPerNode", { valueAsNumber: true })}
                className="flex-grow p-2 rounded border-2"
                id="ramPerNode"
              >
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
                <option value="96">96</option>
                <option value="128">128</option>
                <option value="192">192</option>
                <option value="256">256</option>
                <option value="512">512</option>
                <option value="1024">1024</option>
                <option value="2048">2048</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="typeOfSSD">
                Type of SSD
              </label>
              <select
                className="flex-grow p-2 rounded border-2"
                {...register("typeOfSSD")}
                id="typeOfSSD"
              >
                <option value="high_ssd">High Performance</option>
                <option value="mid_ssd">Medium Performance</option>
                <option value="low_ssd">Low Performance</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="storagePerNode">
                Storage per Node (GB)
              </label>
              <input
                {...register("storagePerNode", {
                  valueAsNumber: true,
                  validate: (value) =>
                    value >= 0 || "storage cannot be less than 0",
                })}
                className={`flex-grow p-2 rounded border-2 ${
                  errors.storagePerNode ? "border-red-500" : "border-gray-200"
                }`}
                type="number"
                placeholder="64"
                id="storagePerNode"
                min="1"
                onChange={(event) => inputCheck(event, "storagePerNode", 0)}
              />
              {errors.storagePerNode && (
                <span className="font-bold text-red-500">
                  {" "}
                  {errors.storagePerNode.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center w-full">
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[47px]">
              <label className="block text-sm" htmlFor="gpu">
                Add GPU
              </label>
              <select
                {...register("gpu")}
                className="flex-grow p-2 rounded border-2"
                id="gpu"
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            {gpu === "Yes" && (
              <>
                <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
                  <label className="block text-sm" htmlFor="gpu_perNode">
                    GPU Per Node
                  </label>
                  <select
                    {...register("gpu_perNode", { valueAsNumber: true })}
                    className="flex-grow p-2 rounded border-2"
                    id="gpu_perNode"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="4">4</option>
                    <option value="6">6</option>
                    <option value="8">8</option>
                  </select>
                </div>
                <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
                  <label className="block text-sm" htmlFor="gpu_model">
                    GPU Model
                  </label>
                  <select
                    {...register("gpu_model")}
                    className="flex-grow p-2 rounded border-2"
                    id="gpu_model"
                  >
                    <option value="H100">Nvidia H100</option>
                    <option value="A100_40">Nvidia A100 40GB</option>
                    <option value="A100_80">Nvidia A100 80GB</option>
                    <option value="A40">Nvidia A40</option>
                    <option value="A30">Nvidia A30</option>
                    <option value="L4">Nvidia L4</option>
                    <option value="T4">Nvidia T4</option>
                    <option value="V100">Nvidia V100</option>
                  </select>
                </div>
              </>
            )}
            <div className="flex flex-wrap justify-center items-center flex-grow xs:w-auto">
              <div
                className={`w-full sm:w-[550px] border-greenish bg-yellowish bg-opacity-40 border-2 font-bold py-1 px-3 rounded-lg shadow mt-3 md:mr-[180px]`}
              >
                Total Cluster Cost: $
                {totalClusterCost.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      {mode === "Customizable" && (
        <div className="flex flex-col space-y-3">
          <div
            className={`flex flex-wrap ${
              errors.homeNodeCount || errors.custom_core_per_node
                ? "items-center"
                : "items-end"
            } w-full`}
          >
            {" "}
            <select
              {...register("mode")}
              className="w-full sm:w-[200px] p-[9px] rounded border-gray border-2 mb-3 sm:mr-[46px]"
              id="mode"
            >
              <option value="Guided">Guided</option>
              <option value="Customizable">Customizable</option>
            </select>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-3 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="homeNodeCount">
                Number of Nodes
              </label>
              <input
                {...register("homeNodeCount", {
                  valueAsNumber: true,
                  validate: (value) => value > 0 || "Nodes must be more than 0",
                })}
                className={`flex-grow p-2 rounded border-2  ${
                  errors.homeNodeCount ? "border-red-500" : "border-gray-200"
                }`}
                id="homeNodeCount"
                type="number"
                placeholder="1"
                min="1"
                onChange={(event) => inputCheck(event, "homeNodeCount", 1)}
              />
              {errors.homeNodeCount && (
                <span className="font-bold text-red-500">
                  {" "}
                  {errors.homeNodeCount.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-3 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="homeNodeCount">
                Cost Per Node ($)
              </label>
              <input
                {...register("custom_cost_per_node", {
                  valueAsNumber: true,
                  validate: (value) =>
                    value >= 0 || "cost cannot be less than 0",
                })}
                className={`flex-grow p-2 rounded border-2  ${
                  errors.custom_cost_per_node
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                id="custom_cost_per_node"
                type="number"
                placeholder="1"
                min="1"
                onChange={(event) =>
                  inputCheck(event, "custom_cost_per_node", 0)
                }
              />
              {errors.custom_cost_per_node && (
                <span className="font-bold text-red-500">
                  {" "}
                  {errors.custom_cost_per_node.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-3 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="custom_core_per_node">
                Core Per Node
              </label>
              <input
                {...register("custom_core_per_node", {
                  valueAsNumber: true,
                  validate: (value) =>
                    value >= 1 || "cores cannot be less than 1",
                })}
                className={`flex-grow p-2 rounded border-2 ${
                  errors.custom_core_per_node
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                id="custom_core_per_node"
                type="number"
                placeholder="1"
                min="1"
                onChange={(event) =>
                  inputCheck(event, "custom_core_per_node", 1)
                }
              />
              {errors.custom_core_per_node && (
                <span className="font-bold text-red-500">
                  {" "}
                  {errors.custom_core_per_node.message}
                </span>
              )}
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-3 sm:mr-[46px]">
              <label className="block text-sm" htmlFor="ramPerNode">
                Ram per Node
              </label>
              <select
                {...register("ramPerNode", { valueAsNumber: true })}
                className="flex-grow p-[9px] rounded border-2"
                id="ramPerNode"
              >
                <option value="4">4</option>
                <option value="8">8</option>
                <option value="16">16</option>
                <option value="32">32</option>
                <option value="64">64</option>
                <option value="96">96</option>
                <option value="128">128</option>
                <option value="192">192</option>
                <option value="256">256</option>
                <option value="512">512</option>
                <option value="1024">1024</option>
                <option value="2048">2048</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-3 sm:mr-[50px]">
              <label className="block text-sm" htmlFor="storagePerNode">
                Storage per Node (GB)
              </label>
              <input
                {...register("storagePerNode", {
                  valueAsNumber: true,
                  validate: (value) =>
                    value >= 1 || "storage cannot be less than 1",
                })}
                className={`flex-grow p-2 rounded border-2 ${
                  errors.storagePerNode ? "border-red-500" : "border-gray-200"
                }`}
                type="number"
                placeholder="64"
                id="storagePerNode"
                min="1"
                onChange={(event) => inputCheck(event, "storagePerNode", 1)}
              />
              {errors.storagePerNode && (
                <span className="font-bold text-red-500">
                  {" "}
                  {errors.storagePerNode.message}
                </span>
              )}
            </div>
            <div className="flex flex-wrap justify-center items-center flex-grow xs:w-auto">
              <div className="w-full md:w-[285px] border-green-500 bg-green-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-4 mt-3 md:mr-[30px] ">
                Total Cores: {totalClusterCore}
              </div>
              <div className="w-full md:w-[285px] border-sky-500 bg-sky-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-4 mt-3 md:mr-[30px] ">
                Total Mem: {totalRam} GB
              </div>
              <div className="w-full md:w-[285px] border-teal-500 border-2 bg-teal-100 font-bold py-1 px-3 rounded-lg shadow mb-4 mt-3 md:mr-[30px]">
                Total Storage: {totalStorage} GB
              </div>
            </div>
            <div className="flex flex-wrap justify-center items-center flex-grow xs:w-auto">
              <div
                className={`w-full lg:w-[550px] border-greenish bg-yellowish bg-opacity-40 border-2 font-bold py-1 px-3 rounded-lg mt-3 mb-2 shadow md:mr-[30px] 2xl:ml-[100px] 2xl:mr-[100px]`}
              >
                Total Cluster Cost: $
                {totalClusterCost.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Server;
