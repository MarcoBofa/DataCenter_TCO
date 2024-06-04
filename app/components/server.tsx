"use client";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";

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
}

const Server: React.FC<ServerProps> = ({
  index,
  nodeCount,
  updateServerCluster,
  updateServerNodeCluster,
  updateServerNodeConsumption,
  updateServerCoreNumber,
}) => {
  const { control, register } = useForm<localProps>({
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
    },
  });

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

  let cost_core = 120;
  const cost_gb_mem = 10;
  const cost_rack = 1700;
  const cost_chassis_U = 400;
  //const cost_chassis_U_liquid = 400;
  const cost_chassis_2U = 1000;
  const cost_chassis_2U_liquid = 1500;
  const cost_motherboard_single = 600;
  const cost_motherboard_dual = 950;
  const ethernet_nics = 110;
  const low_SSD = 0.1;
  const mid_SSD = 0.3;
  const high_SSD = 0.55;
  const low_hdd = 0.015;
  const high_hdd = 0.25;
  const extra_cost_per_node = 50;
  const motherBoardConsumption = 60;
  const ramConsumption = 24;
  const storageConsumption = 5;
  const psu_800w = 800;

  const H100 = 30000;
  const A100_40 = 8000;
  const A100_80 = 13000;
  const A40 = 6000;
  const A30 = 5000;
  const T4 = 1000;
  const V100 = 3000;
  const NVlinkSwitch = 1.3;

  const calcPowerRating = () => {
    let p = 0;

    p +=
      motherBoardConsumption * homeNodeCount +
      Math.ceil(totalRam / 256) * ramConsumption +
      Math.ceil(totalStorage / 1000) * storageConsumption +
      psu_800w * 0.04 * homeNodeCount * 2;

    switch (cpu) {
      case "intel_max":
        p += 350 * homeNodeCount * processorsPerNode;
        break;
      case "intel_plat":
        p += 331 * homeNodeCount * processorsPerNode;
        break;
      case "intel_gold":
        p += 234 * homeNodeCount * processorsPerNode;
        break;
      case "intel_sil":
        p += 145 * homeNodeCount * processorsPerNode;
        break;
      case "amd_bergamo":
        p += 335 * homeNodeCount * processorsPerNode;
        break;
      case "amd_siena":
        p += 150 * homeNodeCount * processorsPerNode;
        break;
      case "amd_genoax":
        p += 340 * homeNodeCount * processorsPerNode;
        break;
      case "amd_genoa":
        p += 300 * homeNodeCount * processorsPerNode;
        break;
    }

    if (gpu == "Yes") {
      switch (gpu_model) {
        case "H100": {
          p += NVlinkSwitch * 700 * homeNodeCount * gpu_perNode;
          break;
        }
        case "A100_40": {
          p += NVlinkSwitch * 350 * homeNodeCount * gpu_perNode;
          break;
        }
        case "A100_80": {
          p += NVlinkSwitch * 400 * homeNodeCount * gpu_perNode;
          break;
        }
        case "A40": {
          p += NVlinkSwitch * 185 * homeNodeCount * gpu_perNode;
          break;
        }
        case "A30": {
          p += NVlinkSwitch * 165 * homeNodeCount * gpu_perNode;
          break;
        }
        case "T4": {
          p += 100 * homeNodeCount * gpu_perNode;
          break;
        }
        case "V100": {
          p += NVlinkSwitch * 250 * homeNodeCount * gpu_perNode;
          break;
        }
      }

      if (gpu_perNode > 6) {
        p += psu_800w * 0.04 * homeNodeCount * 4;
      } else if (gpu_perNode > 4) {
        p += psu_800w * 0.04 * homeNodeCount * 3;
      } else if (gpu_perNode > 2) {
        p += psu_800w * 0.04 * homeNodeCount * 2;
      } else {
        p += psu_800w * 0.04 * homeNodeCount;
      }
    }

    return p;
  };

  useEffect(() => {
    switch (cpu) {
      case "intel_max":
        cost_core = 226;
        break;
      case "intel_plat":
        cost_core = 151;
        break;
      case "intel_gold":
        cost_core = 115;
        break;
      case "intel_sil":
        cost_core = 54;
        break;
      case "amd_bergamo":
        cost_core = 131;
        break;
      case "amd_siena":
        cost_core = 57;
        break;
      case "amd_genoax":
        cost_core = 175;
        break;
      case "amd_genoa":
        cost_core = 118;
        break;
    }

    const costCores = totalCores * cost_core;
    const costRam = totalRam * cost_gb_mem;
    let costStorage = totalStorage * high_SSD;
    let costGpu = H100;
    let costMotherBoard = cost_motherboard_single;
    let costChassis = cost_chassis_U;
    let serverConsumption = 0;

    switch (typeOfSSD) {
      case "mid_ssd": {
        costStorage = totalStorage * mid_SSD;
        break;
      }

      case "low_ssd": {
        costStorage = totalStorage * low_SSD;
        break;
      }
    }

    if (gpu == "Yes") {
      switch (gpu_model) {
        case "A100_40": {
          costGpu = A100_40;
          break;
        }
        case "A100_80": {
          costGpu = A100_80;
          break;
        }
        case "A40": {
          costGpu = A40;
          break;
        }
        case "A30": {
          costGpu = A30;
          break;
        }
        case "T4": {
          costGpu = T4;
          break;
        }
        case "V100": {
          costGpu = V100;
          break;
        }
      }
    } else {
      costGpu = 0;
    }

    if (processorsPerNode == 2) {
      costMotherBoard = cost_motherboard_dual;
      costChassis = cost_chassis_2U;
    }

    serverConsumption = calcPowerRating();

    const rackNum = Math.ceil(((homeNodeCount * 2) / 42) * 0.85);
    const rackCost = rackNum * cost_rack;

    let totalCost =
      extra_cost_per_node * homeNodeCount +
      ethernet_nics * homeNodeCount +
      costMotherBoard * homeNodeCount +
      costChassis * homeNodeCount +
      rackCost +
      costCores +
      costRam +
      costGpu * homeNodeCount * gpu_perNode +
      costStorage;

    if (gpu == "Yes" && gpu_perNode > 4) {
      totalCost += costChassis * homeNodeCount * 2;
    } else {
      totalCost += costChassis * homeNodeCount;
    }

    if (nodeCount >= 50 && nodeCount <= 100) {
      totalCost = totalCost * 0.9;
    } else if (nodeCount > 100 && nodeCount <= 300) {
      totalCost = totalCost * 0.85;
    } else if (nodeCount > 300 && nodeCount <= 500) {
      totalCost = totalCost * 0.8;
    } else if (nodeCount > 500) {
      totalCost = totalCost * 0.75;
    } else if (nodeCount > 5000) {
      totalCost = totalCost * 0.6;
    }

    updateServerNodeConsumption(index, serverConsumption);
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
  ]);

  return (
    <div className="flex flex-col space-y-3">
      <div className="flex flex-wrap items-center w-full">
        <select
          {...register("mode")}
          className="w-full sm:w-[180px] p-2 rounded border-gray border-2 mb-2 sm:mr-[50px]"
          id="mode"
        >
          <option value="Guided">Guided</option>
          <option value="Customizable">Customizable</option>
        </select>
        <select
          {...register("cpu")}
          className="w-full sm:w-[190px] p-2 rounded border-gray border-2 mb-2 sm:mr-[50px]"
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
        <div className="flex flex-wrap justify-center items-center w-full xs:w-auto">
          <div className="w-[285px] border-green-500 bg-green-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
            Total Cores: {totalCores}
          </div>
          <div className="w-[285px] border-sky-500 bg-sky-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
            Total Mem: {totalRam} GB
          </div>
          <div className="w-[285px] border-red-500 border-2 bg-red-100 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
            Total Storage: {totalStorage} GB
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center w-full ">
        <div className="flex flex-col space-y-1 w-full sm:w-[190px] mb-2 sm:mr-[46px]">
          <label className="block text-sm" htmlFor="homeNodeCount">
            Number of Nodes
          </label>
          <input
            {...register("homeNodeCount", { valueAsNumber: true })}
            className="flex-grow p-2 rounded border-2"
            id="homeNodeCount"
            type="number"
            placeholder="1"
          />
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[190px] mb-2 sm:mr-[50px]">
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
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="coresPerProcessor">
            Cores per Processors
          </label>
          <select
            {...register("coresPerProcessor", { valueAsNumber: true })}
            className="flex-grow p-2 rounded border-2"
            id="coresPerProcessor"
          >
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
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
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
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
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
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="storagePerNode">
            Storage per Node (GB)
          </label>
          <input
            {...register("storagePerNode", { valueAsNumber: true })}
            className="flex-grow p-2 rounded border-2"
            type="number"
            placeholder="64"
            id="storagePerNode"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center w-full">
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
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
                <option value="T4">Nvidia T4</option>
                <option value="V100">Nvidia V100</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Server;
