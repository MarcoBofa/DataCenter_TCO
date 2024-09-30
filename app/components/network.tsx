"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./comp.css";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";

interface LocalProps {
  provider: string;
  topology: string;
  bandwidth: number;
  tier: number;
}

const StyledInput = styled(Input)`
  width: 42px;
`;

interface BandwidthConfig {
  [key: string]: {
    hca: number;
    hca_multiplier: number;
    cable: number;
    cable_multiplier: number;
    num_ports: number;
    switch_cost: number;
  };
}

interface GpuConfig {
  [key: string]: {
    [key: string]: {
      hca_multiplier: number;
      cable_multiplier: number;
    };
  };
}

interface TopologyConfig {
  [key: string]: {
    uplinkPortFactors?: { [key: string]: number };
    defaultUplinkFactor?: number;
    portDistributions?: {
      [key: string]: {
        nodes: number;
        intraGroup: number;
        interGroup: number;
      };
    };
  };
}

interface NetworkProps {
  homeBandwidth: number;
  totalNetCost: number;
  nodes: number;
  tier: number;
  totalNetworkConsumption: number;
  totalGpuNum: number;
  setTotalNetworkConsumption: (value: number) => void;
  setTier: (value: number) => void;
  setBandwidth: (value: number) => void;
  setTotalNetCost: (value: number) => void;
}

const Network: React.FC<NetworkProps> = ({
  homeBandwidth,
  totalNetCost,
  nodes,
  tier,
  totalNetworkConsumption,
  totalGpuNum,
  setTier,
  setBandwidth,
  setTotalNetCost,
  setTotalNetworkConsumption,
}) => {
  const { register, watch } = useForm<LocalProps>({
    defaultValues: {
      provider: "infiniband",
      topology: "Leaf-Spine",
      bandwidth: 100,
      tier: 2,
    },
  });

  const [sliderValue, setSliderValue] = useState<number>(0);

  const handleSliderChange = (
    event: React.SyntheticEvent | Event,
    newValue: number | number[]
  ) => {
    setSliderValue(newValue as number);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(event.target.value === "" ? 0 : Number(event.target.value));
  };

  const handleBlur = () => {
    if (sliderValue < -99) {
      setSliderValue(-99);
    } else if (sliderValue > 99) {
      setSliderValue(99);
    }
  };

  const provider = watch("provider");
  const topology = watch("topology");
  const bandwidth = watch("bandwidth");
  const tierLevel = watch("tier");

  const HCA_100gb = 719;
  const HCA_200gb = 1079;
  const HCA_400gb = 1499;
  const EDR_100gb_cable = 179;
  const EDR_200gb_cable = 479;
  const HDR_50gb_switch = 16252 * 0.5;
  const HDR_100gb_switch = 16252 * 0.7;
  const HDR_200gb_switch = 16252;
  const HDR_400gb_switch = 31498;

  const paloAlto_main_FW = 101580;
  const paloAlto_branch_FW = 16613;

  const cisco_main_router = 50000;
  const cisco_branch_router = 1200;

  const hca_consumption = 5;
  const switch_consumption = 784;

  // Bandwidth configurations with string keys
  const bandwidthConfig: BandwidthConfig = {
    "50": {
      hca: HCA_100gb,
      hca_multiplier: 0.65,
      cable: EDR_100gb_cable,
      cable_multiplier: 0.65,
      num_ports: 30,
      switch_cost: HDR_50gb_switch,
    },
    "100": {
      hca: HCA_100gb,
      hca_multiplier: 1,
      cable: EDR_100gb_cable,
      cable_multiplier: 1,
      num_ports: 35,
      switch_cost: HDR_100gb_switch,
    },
    "200": {
      hca: HCA_200gb,
      hca_multiplier: 1,
      cable: EDR_200gb_cable,
      cable_multiplier: 1,
      num_ports: 40,
      switch_cost: HDR_200gb_switch,
    },
    "400": {
      hca: HCA_400gb,
      hca_multiplier: 1,
      cable: EDR_200gb_cable,
      cable_multiplier: 1.5,
      num_ports: 64,
      switch_cost: HDR_400gb_switch,
    },
  };

  // GPU configurations with string keys
  const gpuConfig: GpuConfig = {
    "2": {
      "50": { hca_multiplier: 0.15, cable_multiplier: 0.15 },
      "100": { hca_multiplier: 0.2, cable_multiplier: 0.2 },
      "200": { hca_multiplier: 0.25, cable_multiplier: 0.25 },
      "400": { hca_multiplier: 0.3, cable_multiplier: 1.8 },
    },
    "4": {
      "50": { hca_multiplier: 0.2, cable_multiplier: 0.2 },
      "100": { hca_multiplier: 0.25, cable_multiplier: 0.25 },
      "200": { hca_multiplier: 0.3, cable_multiplier: 0.3 },
      "400": { hca_multiplier: 0.35, cable_multiplier: 1.85 },
    },
    "6": {
      "50": { hca_multiplier: 0.25, cable_multiplier: 0.25 },
      "100": { hca_multiplier: 0.3, cable_multiplier: 0.3 },
      "200": { hca_multiplier: 0.37, cable_multiplier: 0.37 },
      "400": { hca_multiplier: 0.45, cable_multiplier: 1.95 },
    },
  };

  // Topology configurations with string keys
  const topologyConfig: TopologyConfig = {
    "Leaf-Spine": {
      uplinkPortFactors: { "2": 0.22, "3": 0.3, "4": 0.35 },
      defaultUplinkFactor: 0.15,
    },
    Dragonfly: {
      portDistributions: {
        "1": { nodes: 0.6, intraGroup: 0.2, interGroup: 0.2 },
        "2": { nodes: 0.5, intraGroup: 0.25, interGroup: 0.25 },
        "3": { nodes: 0.45, intraGroup: 0.275, interGroup: 0.275 },
        "4": { nodes: 0.4, intraGroup: 0.3, interGroup: 0.3 },
      },
    },
    "Fat-Tree": {},
  };

  useEffect(() => {
    let cost = 0;
    let numSwitches = 0;
    let num_ports = 40; // Default value
    let netConsumption = 0;

    // Convert bandwidth to string
    const bandwidthKey = bandwidth.toString();

    // Get bandwidth configuration
    const bwConfig = bandwidthConfig[bandwidthKey];
    if (bwConfig) {
      num_ports = bwConfig.num_ports;

      // Initial cost calculations
      cost += nodes * bwConfig.hca * bwConfig.hca_multiplier;
      cost += nodes * bwConfig.cable * bwConfig.cable_multiplier;
    }

    // Calculate GPUs per node
    const gpu_per_node = Math.floor(totalGpuNum / nodes);

    // Determine GPU configuration threshold
    let gpuThreshold = 0;
    if (gpu_per_node >= 6) gpuThreshold = 6;
    else if (gpu_per_node >= 4) gpuThreshold = 4;
    else if (gpu_per_node >= 2) gpuThreshold = 2;

    const gpuThresholdKey = gpuThreshold.toString();

    // GPU-related calculations
    if (
      gpuThreshold > 0 &&
      gpuConfig[gpuThresholdKey] &&
      gpuConfig[gpuThresholdKey][bandwidthKey]
    ) {
      const gpuBwConfig = gpuConfig[gpuThresholdKey][bandwidthKey];
      if (bwConfig && gpuBwConfig) {
        cost += totalGpuNum * bwConfig.hca * gpuBwConfig.hca_multiplier;
        cost += totalGpuNum * bwConfig.cable * gpuBwConfig.cable_multiplier;
      }
    }

    // Topology-based calculations
    if (topology === "Leaf-Spine") {
      const tierLevelKey = tierLevel.toString();
      const uplinkFactor =
        topologyConfig["Leaf-Spine"].uplinkPortFactors?.[tierLevelKey] ||
        topologyConfig["Leaf-Spine"].defaultUplinkFactor!;
      const num_uplink_ports = num_ports * uplinkFactor;

      numSwitches = Math.ceil(nodes / (num_ports - num_uplink_ports)) + 1;
      const additionalSwitches = Math.ceil((numSwitches * 2) / (num_ports - 1));
      numSwitches += additionalSwitches < 2 ? 2 : additionalSwitches;

      if (bandwidth === 400) {
        numSwitches = Math.ceil(numSwitches * 1.2);
      }
    } else if (topology === "Dragonfly") {
      const tierLevelKey = tierLevel.toString();
      const portDist =
        topologyConfig["Dragonfly"].portDistributions?.[tierLevelKey] ||
        topologyConfig["Dragonfly"].portDistributions?.["1"]!;
      const num_ports_nodes = num_ports * portDist.nodes;

      numSwitches = Math.ceil(nodes / num_ports_nodes);

      if (bandwidth === 400) {
        numSwitches = Math.ceil(numSwitches * 1.2);
      }
    } else if (topology === "Fat-Tree") {
      const k = num_ports; // Number of ports per switch
      const num_nodes_per_edge_switch = k / 2; // Each edge switch connects to k/2 nodes

      let num_edge_switches = Math.ceil(nodes / num_nodes_per_edge_switch);
      let num_agg_switches = num_edge_switches;
      let num_core_switches = Math.pow(k / 2, 2) / (k / 2);

      // Adjust for redundancy based on tier level
      const redundancyFactor = 1 + (tierLevel - 1) * 0.1;
      num_edge_switches = Math.ceil(num_edge_switches * redundancyFactor);
      num_agg_switches = Math.ceil(num_agg_switches * redundancyFactor);
      num_core_switches = Math.ceil(num_core_switches * redundancyFactor);

      numSwitches = num_edge_switches + num_agg_switches + num_core_switches;

      if (bandwidth === 400) {
        numSwitches = Math.ceil(numSwitches * 1.2);
      }
    }

    // Switch cost based on bandwidth
    if (bwConfig) {
      cost += numSwitches * bwConfig.switch_cost;
    }

    // Additional cost calculations
    const branchNum = Math.floor(nodes / 70);
    cost += branchNum * paloAlto_branch_FW;

    netConsumption =
      numSwitches * switch_consumption +
      nodes * hca_consumption +
      180 * branchNum +
      45 * nodes;

    const branchRouterNum = Math.ceil(nodes / 60);
    cost += branchRouterNum * cisco_branch_router;

    netConsumption += branchRouterNum * 150;

    cost += 480 * nodes + 350 * nodes;

    // Provider discount
    if (provider === "slingshot") {
      cost *= 0.9;
    }

    // Apply slider value adjustment
    cost *= 1 + sliderValue / 100;

    // Update states
    setTotalNetworkConsumption(netConsumption);
    setTotalNetCost(cost);
    setTier(tierLevel);
    setBandwidth(bandwidth);
  }, [
    provider,
    bandwidth,
    nodes,
    tierLevel,
    topology,
    totalGpuNum,
    sliderValue,
    setTotalNetworkConsumption,
    setTotalNetCost,
    setTier,
    setBandwidth,
  ]);

  return (
    <div className="flex flex-col space-y-3 p-4 relative">
      <div className="flex flex-wrap items-center w-full">
        <select
          {...register("provider")}
          className="w-full sm:w-[200px] p-2 rounded border-gray border-2 mb-3 sm:mr-[50px]"
        >
          <option value="infiniband">Nvidia Mellanox Infiniband</option>
          <option value="slingshot">HPE Cray Slingshot</option>
        </select>
        <div className="w-full md:w-[450px] border-orange-500 bg-orange-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 md:mr-[50px] mt-2 mdd:mt-[-5px]">
          Network Cost: $
          {totalNetCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
      </div>

      <div className="flex flex-wrap items-center w-full">
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="tier">
            Tier Level
          </label>
          <select
            {...register("tier", { valueAsNumber: true })}
            className="flex-grow p-2 rounded border-2"
            id="tier"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px] group">
          <div className="flex flex-row items-center justify-center w-full">
            <label className="block text-sm" htmlFor="topology">
              Topology
            </label>
            <div className="info-button-container">
              <div className="z-10 flex justify-center items-center w-[13px] h-[13px] ml-[6px] mt-[2px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
                i
              </div>
              <span
                className="info-box z-20 absolute top-[80px] sm:top-[10px] md:top-[-10px] lg:top-[10px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow hidden"
                style={{
                  width: "calc(80%)", // Full width minus 20px margin on each side
                  maxWidth: "1200px", // Maximum width to match the original design
                }}
              >
                <span className="font-bold">Network Topology</span> dictates the
                arrangement and communication flow between switches, routers,
                servers, and other devices in the data center. Changing the
                topology will result in a different number of components and
                thus cost.
              </span>
            </div>
          </div>
          <select
            {...register("topology")}
            className="flex-grow p-2 rounded border-2"
            id="topology"
          >
            <option value="Leaf-Spine">Leaf-Spine</option>
            <option value="Fat-Tree">Fat-Tree</option>
            <option value="Dragonfly">Dragonfly</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="bandwidth">
            Bandwidth (GbE)
          </label>
          <select
            {...register("bandwidth", { valueAsNumber: true })}
            className="flex-grow p-2 rounded border-2"
            id="bandwidth"
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="400">400</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[691px] mb-2 mt-4 xl:mr-[300px] ml-4 items-center">
          <Box sx={{ width: "100%" }}>
            <Typography id="input-slider" gutterBottom>
              Adjust Cost ({sliderValue}%)
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item></Grid>
              <Grid item xs>
                <Slider
                  value={sliderValue}
                  onChange={handleSliderChange}
                  aria-labelledby="input-slider"
                  min={-99}
                  max={99}
                  sx={{
                    "& .MuiSlider-thumb": {
                      color: "#38b2ac", // Tailwind teal 500 color
                    },
                    "& .MuiSlider-track": {
                      color: "#38b2ac", // Tailwind teal 500 color
                    },
                    "& .MuiSlider-rail": {
                      color: "lightgray", // Light gray track color
                    },
                    height: 7,
                  }}
                />
              </Grid>
              <Grid item>
                <StyledInput
                  className="mb-7"
                  value={sliderValue}
                  size="small"
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  inputProps={{
                    step: 1,
                    min: -99,
                    max: 99,
                    type: "number",
                    "aria-labelledby": "input-slider",
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default Network;
