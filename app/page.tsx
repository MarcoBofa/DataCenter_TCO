"use client";
import React, { useState, useEffect, useCallback } from "react";
import Land from "./components/land";
import Server from "./components/server";
import Network from "./components/network";
import PieChart from "./components/pieChart";
import { v4 as uuidv4 } from "uuid";
import PowerDistribution from "./components/powerDistribution";
import PowerCost from "./components/powerCost";
import { copyFileSync } from "fs";
import SoftwareLicense from "./components/softwareLicense";

interface serverClusterProps {
  id: string;
  nodeCount: number;
  totalCost: number;
  serverConsumption: number;
  coreNumber: number;
}

export default function Home() {
  const [serverClusters, setServerClusters] = useState<serverClusterProps[]>(
    []
  );
  const [totalCost, setTotalCost] = useState(0);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [propertyValue, setPropertyValue] = useState(0);
  const [bandwidth, setBandwidth] = useState(50);
  const [totalNetCost, setTotalNetCost] = useState(0);
  const [tier, setTier] = useState(2);
  const [totalServerConsumption, setTotalServerConsumption] = useState(0);
  const [totalNetworkConsumption, setTotalNetworkConsumption] = useState(0);
  const [totalPCost, setTotalPCost] = useState(0);
  const [costOfPower, setCostOfPower] = useState(0);
  const [totalServerCost, setTotalServerCost] = useState(0);
  const [coresNumber, setCoreNumber] = useState(0);
  const [softwareLicenseCost, setSoftwareLicenseCost] = useState(0);

  const [pue, setPueValue] = useState(1.35);

  useEffect(() => {
    const totalServerCosttemp = serverClusters.reduce(
      (sum, cluster) => sum + cluster.totalCost,
      0
    );
    const totalNode = serverClusters.reduce(
      (sum, cluster) => sum + cluster.nodeCount,
      0
    );
    const totalServerP = serverClusters.reduce(
      (sum, cluster) => sum + cluster.serverConsumption,
      0
    );

    const totalCoreNumber = serverClusters.reduce(
      (sum, cluster) => sum + cluster.coreNumber,
      0
    );

    setCoreNumber(totalCoreNumber);
    setTotalServerConsumption(totalServerP);
    setTotalNodeCount(totalNode);
    setTotalCost(
      totalServerCosttemp + totalNetCost + propertyValue + totalPCost
    );
    setTotalServerCost(totalServerCosttemp);
  }, [
    serverClusters,
    totalNetCost,
    propertyValue,
    totalServerConsumption,
    totalPCost,
    coresNumber,
  ]);

  const addServerCluster = () => {
    setServerClusters([
      ...serverClusters,
      {
        id: uuidv4(),
        nodeCount: 1,
        totalCost: 0,
        serverConsumption: 0,
        coreNumber: 0,
      },
    ]);
  };

  const removeServerCluster = (id: string) => {
    setServerClusters(serverClusters.filter((cluster) => cluster.id !== id));
  };

  const updateServerCluster = useCallback((id: string, newCost: number) => {
    setServerClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, totalCost: newCost } : cluster
      )
    );
  }, []);

  const updateServerNodeCluster = useCallback((id: string, newNode: number) => {
    setServerClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, nodeCount: newNode } : cluster
      )
    );
  }, []);

  const updateServerCoreNumber = useCallback((id: string, newNode: number) => {
    setServerClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, coreNumber: newNode } : cluster
      )
    );
  }, []);

  const updateServerNodeConsumption = useCallback(
    (id: string, newCons: number) => {
      setServerClusters((prevClusters) =>
        prevClusters.map((cluster) =>
          cluster.id === id
            ? { ...cluster, serverConsumption: newCons }
            : cluster
        )
      );
    },
    []
  );

  return (
    <main className="flex flex-col text-center justify-center space-y-[50px] items-center bg-grey-100 h-full bg-gray-100 pb-[50px]">
      <div className="text-2xl font-bold mt-[20px]">
        DATA CENTER TCO CALCULATOR
      </div>
      <div className="w-7/8 bg-white text-left pb-10 rounded-2xl">
        <div className="p-4 font-bold">LAND & BUILDING</div>
        <Land
          homePropertyValue={propertyValue}
          setPropertyValue={setPropertyValue}
        />
      </div>

      {serverClusters.map((cluster) => (
        <div
          className="w-7/8 bg-white pb-10 rounded-2xl mb-4 relative"
          key={cluster.id}
        >
          <div className="p-4 font-bold w-full text-left">SERVER</div>
          <div className="flex justify-between items-center p-4">
            <Server
              index={cluster.id}
              nodeCount={cluster.nodeCount}
              updateServerCluster={updateServerCluster}
              updateServerNodeCluster={updateServerNodeCluster}
              updateServerNodeConsumption={updateServerNodeConsumption}
              updateServerCoreNumber={updateServerCoreNumber}
            />
            <button
              onClick={() => removeServerCluster(cluster.id)}
              className="ml-2 p-1 bg-red-500 text-white rounded hover:bg-red-700 absolute right-4 bottom-4"
            >
              Remove Server Node
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={addServerCluster}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Add Server Node
        </button>
      </div>

      <div className="w-7/8 bg-white pb-10 rounded-2xl">
        <div className="p-4 font-bold w-full text-left">NETWORKING</div>
        <Network
          homeBandwidth={bandwidth}
          setBandwidth={setBandwidth}
          nodes={totalNodeCount}
          tier={tier}
          setTier={setTier}
          totalNetCost={totalNetCost}
          setTotalNetCost={setTotalNetCost}
          totalNetworkConsumption={totalNetworkConsumption}
          setTotalNetworkConsumption={setTotalNetworkConsumption}
        />
      </div>

      <div className="w-7/8 bg-white pb-10 rounded-2xl">
        <div className="p-4 font-bold w-full text-left">
          POWER DISTRIBUTION AND COOLING INFRASTRUCTURE
        </div>
        <PowerDistribution
          tier={tier}
          homePue={pue}
          totalConsumption={totalNetworkConsumption + totalServerConsumption}
          pdCost={totalPCost}
          setPDcost={setTotalPCost}
          setPueValue={setPueValue}
        />
      </div>

      <div className="w-7/8 bg-white pb-10 rounded-2xl">
        <div className="p-4 font-bold w-full text-left">SOFTWARE LICENSE</div>
        <SoftwareLicense
          nodeCount={totalNodeCount}
          cores={coresNumber}
          softwareCost={softwareLicenseCost}
          setSoftwareCost={setSoftwareLicenseCost}
        />
      </div>

      <div className="w-7/8 bg-white pb-10 rounded-2xl">
        <div className="p-4 font-bold w-full text-left">ENERGY COST</div>
        <PowerCost
          tier={tier}
          pue={pue}
          netConsumption={totalNetworkConsumption}
          serverConsumption={totalServerConsumption}
          nodeCount={totalNodeCount}
          costOfPower={costOfPower}
          setCostOfPower={setCostOfPower}
        />
      </div>

      <div className="flex w-7/8 bg-white pb-2 rounded-2xl items-center text-xl justify-center">
        <div className="flex flex-row items-center justify-center w-[500px] mt-2 h-[70px] border-emerald-500 bg-emerald-100 border-2 font-bold py-1 px-3 rounded-lg shadow mr-4">
          <div className="font-bold mr-1">TOTAL COST = $</div>
          {totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
        <div className="flex flex-row items-center justify-center w-[500px] mt-2 h-[70px] border-amber-500 bg-amber-100 border-2 font-bold py-1 px-3 rounded-lg shadow">
          <div className="font-bold mr-1">MAX POWER CONSUMPTION = </div>
          {(
            (totalNetworkConsumption + totalServerConsumption) *
            pue
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
          W
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center w-full">
        <div className="flex flex-col items-center lg:mr-[100px]">
          <h1>Pie Chart Example</h1>
          <PieChart
            serverCost={totalServerCost}
            networkCost={totalNetCost}
            buildingCost={propertyValue}
            powerAndCoolingCost={totalPCost}
            energyCost={costOfPower}
            softwareLicenseCost={softwareLicenseCost}
          />
        </div>
        <div className="flex flex-col items-center">
          <h1>Pie Chart Example</h1>
          <PieChart
            serverCost={totalServerCost / 5}
            networkCost={totalNetCost / 5}
            buildingCost={propertyValue / 20}
            powerAndCoolingCost={totalPCost / 7}
            energyCost={costOfPower}
            softwareLicenseCost={softwareLicenseCost / 5}
          />
        </div>
      </div>
    </main>
  );
}
