"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface LocalProps {
  provider: string;
  topology: string;
  bandwidth: number;
  tier: number;
}

interface NetworkProps {
  homeBandwidth: number;
  totalNetCost: number;
  nodes: number;
  tier: number;
  totalNetworkConsumption: number;
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
  setTier,
  setBandwidth,
  setTotalNetCost,
  setTotalNetworkConsumption,
}) => {
  const { register, handleSubmit, watch } = useForm<LocalProps>({
    defaultValues: {
      provider: "infiniband",
      topology: "Leaf-Spine",
      bandwidth: 100,
      tier: 2,
    },
  });

  const onSubmit = (data: LocalProps) => {
    // Here you would send the data to the backend
    console.log(data);
  };

  const [sliderValue, setSliderValue] = useState(0);

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

  let netConsumption = 0;

  useEffect(() => {
    let cost = 0;
    let numSwitches = 0;
    let num_ports = 40;

    if (bandwidth === 50) {
      cost = nodes * HCA_100gb * 0.65;
      cost += nodes * EDR_100gb_cable * 0.65;
      num_ports = 30;
    } else if (bandwidth === 100) {
      cost = nodes * HCA_100gb;
      cost += nodes * EDR_100gb_cable;
      num_ports = 35;
    } else if (bandwidth === 200) {
      cost = nodes * HCA_200gb;
      cost += nodes * EDR_200gb_cable;
      num_ports = 40;
    } else if (bandwidth === 400) {
      cost = nodes * HCA_400gb;
      cost += nodes * EDR_200gb_cable * 1.5;
      num_ports = 64;
    }

    if (topology === "Leaf-Spine") {
      let num_uplink_ports = num_ports * 0.15;

      switch (tierLevel) {
        case 2: {
          num_uplink_ports = num_ports * 0.22;
          break;
        }
        case 3: {
          num_uplink_ports = num_ports * 0.3;
          break;
        }
        case 4: {
          num_uplink_ports = num_ports * 0.35;
          break;
        }
      }

      numSwitches = Math.ceil(nodes / (num_ports - num_uplink_ports)) + 1;
      Math.ceil((numSwitches * 2) / (num_ports - 1)) < 2
        ? (numSwitches += 2)
        : (numSwitches += Math.ceil((numSwitches * 2) / (num_ports - 1)));

      if (bandwidth === 400) {
        numSwitches = Math.ceil(numSwitches * 1.2);
      }
    } else if (topology === "Dragonfly") {
      let num_ports_intraGroup = 0;
      let num_ports_interGroup = 0;
      let num_ports_nodes = 0;

      switch (tierLevel) {
        case 1: {
          num_ports_nodes = num_ports * 0.6;
          num_ports_intraGroup = num_ports * 0.2;
          num_ports_interGroup = num_ports * 0.2;
          break;
        }
        case 2: {
          num_ports_nodes = num_ports * 0.5;
          num_ports_intraGroup = num_ports * 0.25;
          num_ports_interGroup = num_ports * 0.25;
          break;
        }
        case 3: {
          num_ports_nodes = num_ports * 0.45;
          num_ports_intraGroup = num_ports * 0.275;
          num_ports_interGroup = num_ports * 0.275;
          break;
        }
        case 4: {
          num_ports_nodes = num_ports * 0.4;
          num_ports_intraGroup = num_ports * 0.3;
          num_ports_interGroup = num_ports * 0.3;
          break;
        }
      }
      numSwitches = Math.ceil(nodes / num_ports_nodes);

      if (bandwidth === 400) {
        numSwitches = Math.ceil(numSwitches * 1.2);
      }
    } else if (topology === "Fat-Tree") {
      let k = num_ports; // Number of ports per switch
      let num_nodes_per_edge_switch = k / 2; // Each edge switch connects to k/2 nodes

      // Calculate the number of edge switches
      let num_edge_switches = Math.ceil(nodes / num_nodes_per_edge_switch);

      // Calculate the number of aggregation switches
      let num_agg_switches = num_edge_switches; // Each edge switch pairs with an aggregation switch

      // Calculate the number of core switches
      let num_core_switches = Math.pow(k / 2, 2) / (k / 2); // The core layer interconnects aggregation switches

      // Adjusting for redundancy based on tier level
      switch (tierLevel) {
        case 2:
          num_edge_switches = Math.ceil(num_edge_switches * 1.1);
          num_agg_switches = Math.ceil(num_agg_switches * 1.1);
          num_core_switches = Math.ceil(num_core_switches * 1.1);
          break;
        case 3:
          num_edge_switches = Math.ceil(num_edge_switches * 1.2);
          num_agg_switches = Math.ceil(num_agg_switches * 1.2);
          num_core_switches = Math.ceil(num_core_switches * 1.2);
          break;
        case 4:
          num_edge_switches = Math.ceil(num_edge_switches * 1.3);
          num_agg_switches = Math.ceil(num_agg_switches * 1.3);
          num_core_switches = Math.ceil(num_core_switches * 1.3);
          break;
      }

      // Sum up all switches
      numSwitches = num_edge_switches + num_agg_switches + num_core_switches;

      // Adjust for bandwidth if needed
      if (bandwidth === 400) {
        numSwitches = Math.ceil(numSwitches * 1.2);
      }
    }

    switch (bandwidth) {
      case 50: {
        cost += numSwitches * HDR_50gb_switch;
        break;
      }
      case 100: {
        cost += numSwitches * HDR_100gb_switch;
        break;
      }
      case 200: {
        cost += numSwitches * HDR_200gb_switch;
        break;
      }
      case 400: {
        cost += numSwitches * HDR_400gb_switch;
        break;
      }
    }

    let branchNum = Math.floor(nodes / 70);
    cost += branchNum * paloAlto_branch_FW;

    netConsumption =
      numSwitches * switch_consumption +
      nodes * hca_consumption +
      180 * branchNum +
      45 * nodes;

    branchNum = Math.ceil(nodes / 60);
    cost += branchNum * cisco_branch_router;

    netConsumption += branchNum * 150;

    cost += 480 * nodes + 350 * nodes;

    if (provider === "slingshot") {
      cost = cost * 0.9;
    }

    cost = cost * (1 + sliderValue / 100);

    setTotalNetworkConsumption(netConsumption);
    setTotalNetCost(cost);
    setTier(tierLevel);
  }, [
    provider,
    bandwidth,
    nodes,
    tierLevel,
    topology,
    totalNetworkConsumption,
    sliderValue,
  ]);

  return (
    <div className="flex flex-col space-y-3 p-4">
      <div className="flex flex-wrap items-center w-full">
        <select
          {...register("provider")}
          className="w-full sm:w-[200px] p-2 rounded border-gray border-2 mb-3 sm:mr-[50px]"
        >
          <option value="infiniband">Nvidia Mellanox Infiniband</option>
          <option value="slingshot">HPE Cray Slingshot</option>
        </select>
        <div className="w-[450px] border-orange-500 bg-orange-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
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
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="topology">
            Topology
          </label>
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
            Bandwidth
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
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[700px] mb-2 sm:mr-[50px] items-center">
        <label className="block text-sm text-center" htmlFor="cost-slider">
          Adjust Cost (%)
        </label>
        <input
          type="range"
          id="cost-slider"
          min="-99"
          max="99"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-full cursor-pointer"
        />
        <div className="text-center">{sliderValue}%</div>
      </div>
    </div>
  );
};

export default Network;
