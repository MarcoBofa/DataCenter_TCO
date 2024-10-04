"use client";
import React, { useState, useEffect, useCallback } from "react";
import { TypeAnimation } from "react-type-animation";
import Land from "./components/land";
import Server from "./components/server";
import Network from "./components/network";
import PieChart from "./components/pieChart";
import { v4 as uuidv4 } from "uuid";
import PowerDistribution from "./components/powerDistribution";
import PowerCost from "./components/powerCost";
import SoftwareLicense from "./components/softwareLicense";
import Storage from "./components/storage";
import Labor from "./components/labor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AnimatePresence, motion } from "framer-motion";
import {
  faChevronUp,
  faChevronDown,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";

interface serverClusterProps {
  id: string;
  nodeCount: number;
  GpuPerNode: number;
  totalCost: number;
  serverConsumption: number;
  coreNumber: number;
}

interface storageClusterProps {
  id: string;
  nodeCount: number;
  totalCost: number;
  consumption: number;
  storage: number;
}

export default function Home() {
  const [serverClusters, setServerClusters] = useState<serverClusterProps[]>(
    []
  );
  const [storageCluster, setStorageClusters] = useState<storageClusterProps[]>(
    []
  );
  const [description, setDescription] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [totalNodeCount, setTotalNodeCount] = useState(0);
  const [totalGPUCount, setTotalGPUCount] = useState(0);
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
  const [totalStorageCost, setTotalStorageCost] = useState(0);
  const [totalStorage, setTotalStorage] = useState(0);
  const [laborCost, setLaborCost] = useState(0);
  const [laborChoice, setLaborChoice] = useState(false);

  const [pue, setPueValue] = useState(1.35);

  const addServerCluster = () => {
    setServerClusters([
      ...serverClusters,
      {
        id: uuidv4(),
        nodeCount: 1,
        GpuPerNode: 0,
        totalCost: 0,
        serverConsumption: 0,
        coreNumber: 0,
      },
    ]);
  };

  const addStorageCluster = () => {
    setStorageClusters([
      ...storageCluster,
      {
        id: uuidv4(),
        nodeCount: 1,
        totalCost: 0,
        consumption: 0,
        storage: 0,
      },
    ]);
  };

  const removeServerCluster = (id: string) => {
    setServerClusters(serverClusters.filter((cluster) => cluster.id !== id));
  };

  const removeStorageCluster = (id: string) => {
    setStorageClusters(storageCluster.filter((cluster) => cluster.id !== id));
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

  const updateServerGpuNumber = useCallback((id: string, GpuNode: number) => {
    setServerClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, GpuPerNode: GpuNode } : cluster
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

  const updateStorageNodeConsumption = useCallback(
    (id: string, newCons: number) => {
      setStorageClusters((prevClusters) =>
        prevClusters.map((cluster) =>
          cluster.id === id ? { ...cluster, consumption: newCons } : cluster
        )
      );
    },
    []
  );

  const updateStorageAmount = useCallback((id: string, newNode: number) => {
    setStorageClusters((prevClusters) =>
      prevClusters.map((cluster) =>
        cluster.id === id ? { ...cluster, storage: newNode } : cluster
      )
    );
  }, []);

  const updateStorageClusterCost = useCallback(
    (id: string, newCost: number) => {
      setStorageClusters((prevClusters) =>
        prevClusters.map((cluster) =>
          cluster.id === id ? { ...cluster, totalCost: newCost } : cluster
        )
      );
    },
    []
  );

  const descriptionTexts = [
    "This website provides a practical and easy-to-use tool to estimate the Total Cost of Ownership (TCO) of a Data Center.",
    "The tool is still under construction as it does not yet include all costs associated with a data center, and the models to estimate costs must still be fine-tuned. However, it already serves as a good starting point.",
    "If you have some suggestions or find some errors, please send an email to mbonaf3@uic.edu. Thanks! 😊",
  ];

  // New State Variables for Typewriter Effect
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);

  // Reset typed lines and start typing when description is toggled open
  useEffect(() => {
    if (description) {
      setTypedLines([]);
      setCurrentLineIndex(0);
    }
  }, [description]);

  useEffect(() => {
    // Calculate total costs whenever dependencies change
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

    const tmp_storage = storageCluster.reduce(
      (sum, cluster) => sum + cluster.storage,
      0
    );

    const tmp_storage_consumption = storageCluster.reduce(
      (sum, cluster) => sum + cluster.consumption,
      0
    );

    const tmp_storage_cost = storageCluster.reduce(
      (sum, cluster) => sum + cluster.totalCost,
      0
    );

    let totalGPU = 0;
    serverClusters.forEach((cluster) => {
      if (cluster.GpuPerNode >= 2) {
        totalGPU += cluster.GpuPerNode * cluster.nodeCount;
      }
    });
    setTotalGPUCount(totalGPU);
    setTotalStorageCost(tmp_storage_cost);
    setTotalStorage(tmp_storage);

    setCoreNumber(totalCoreNumber);
    setTotalServerConsumption(totalServerP + tmp_storage_consumption);
    setTotalNodeCount(totalNode);

    setTotalCost(
      totalServerCosttemp +
        totalNetCost +
        propertyValue +
        totalPCost +
        costOfPower +
        tmp_storage_cost +
        softwareLicenseCost +
        (laborChoice ? laborCost : 0)
    );
    setTotalServerCost(totalServerCosttemp);
  }, [
    serverClusters,
    totalNetCost,
    propertyValue,
    totalPCost,
    storageCluster,
    laborChoice,
    laborCost,
    softwareLicenseCost,
  ]);

  return (
    <main className="flex flex-col text-center justify-center space-y-12 text-sm items-center bg-gray-100 h-full pb-12">
      <div className="w-full max-w-4xl px-4">
        <div className="flex flex-row items-center justify-center mt-5">
          <div className="text-2xl font-bold">DATA CENTER TCO CALCULATOR</div>
          <FontAwesomeIcon
            onClick={() => setDescription(!description)}
            className="text-gray-600 text-lg ml-2 cursor-pointer"
            icon={description ? faChevronUp : faChevronDown}
          />
        </div>
        <AnimatePresence>
          {description && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="overflow-hidden mt-4 bg-white p-6 rounded-lg shadow-lg"
            >
              {/* Typewriter Animation */}
              <div>
                {typedLines.map((line, index) => (
                  <p key={index} className="block text-md font-semibold mb-2">
                    {line}
                  </p>
                ))}
                {currentLineIndex < descriptionTexts.length && (
                  <TypeAnimation
                    key={currentLineIndex} // Ensures TypeAnimation resets for each new line
                    sequence={[
                      descriptionTexts[currentLineIndex],
                      200, // Wait for 1 second after typing
                      () => {
                        setTypedLines((prev) => [
                          ...prev,
                          descriptionTexts[currentLineIndex],
                        ]);
                        setCurrentLineIndex((prev) => prev + 1);
                      },
                    ]}
                    speed={80} // Adjust typing speed as needed
                    wrapper="p"
                    cursor={true}
                    repeat={0} // Do not loop the animation
                    style={{ whiteSpace: "pre-line", fontWeight: "600" }}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-7/8 bg-white text-left pb-10 rounded-2xl relative">
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="p-4 font-bold w-full text-left">
              LAND & BUILDING
            </div>

            <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] mr-[5px] xs:ml-[-6px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
              i
            </div>
            <span className="z-10 display-on-hover absolute w-[90%] md:w-[75%] top-[50px] left-[0px] md:top-[06px] md:left-[160px] lg:left-[120px] xl:left-[75px] right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow">
              <span className="font-bold">Land and Building </span>cost refers
              to the expenses associated with acquiring the land and
              constructing the infrastructure necessary to house all the
              required equipment. This does not include the cost of the
              equipment itself.
              <br></br>
              <br></br>
              The customizable option is still under development.
            </span>
          </div>
        </div>
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
          <div className="p-4 font-bold w-full lg:text-left">SERVER</div>
          <div className="flex justify-between items-center p-4">
            <Server
              index={cluster.id}
              nodeCount={cluster.nodeCount}
              updateServerCluster={updateServerCluster}
              updateServerNodeCluster={updateServerNodeCluster}
              updateServerNodeConsumption={updateServerNodeConsumption}
              updateServerCoreNumber={updateServerCoreNumber}
              updateServerGpuNumber={updateServerGpuNumber}
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
      {storageCluster.map((cluster) => (
        <div
          className="w-7/8 bg-white pb-10 rounded-2xl mb-4 relative"
          key={cluster.id}
        >
          <div className="p-4 font-bold w-full lg:text-left">STORAGE</div>
          <div className="flex justify-between items-center p-4">
            <Storage
              index={cluster.id}
              nodeCount={cluster.nodeCount}
              updateStorageClusterCost={updateStorageClusterCost}
              updateStorageAmount={updateStorageAmount}
              updateStorageNodeConsumption={updateStorageNodeConsumption}
            />
            <button
              onClick={() => removeStorageCluster(cluster.id)}
              className="ml-2 p-1 bg-red-500 text-white rounded hover:bg-red-700 absolute right-4 bottom-4"
            >
              Remove Storage Node
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={addServerCluster}
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-700 mr-5"
        >
          Add Server Node
        </button>
        <button
          onClick={addStorageCluster}
          className="p-2 bg-emerald-500 text-white rounded hover:bg-emerald-700"
        >
          Add Storage Node
        </button>
      </div>
      <div className="w-7/8 bg-white pb-10 rounded-2xl relative">
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="p-4 font-bold w-full text-left">NETWORKING</div>
            <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] ml-[-6px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
              i
            </div>
            <span
              className="display-on-hover absolute top-[-90px] xs:top-[-95px] sm:top-[-105px] md:top-[-63px] lg:top-[-63px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow"
              style={{
                width: "calc(100% - 40px)", // Full width minus 20px margin on each side
                maxWidth: "1200px", // Maximum width to match the original design
              }}
            >
              <span className="font-bold">Networking Costs</span> cover the cost
              for all the components of both internal and external network
              connections of the Data center. So it includes Clusters
              Interconnects, cabling, NICs, switches, routers, load balancers,
              firewalls and others.
            </span>
          </div>
        </div>

        <Network
          homeBandwidth={bandwidth}
          setBandwidth={setBandwidth}
          nodes={totalNodeCount}
          tier={tier}
          setTier={setTier}
          totalNetCost={totalNetCost}
          totalGpuNum={totalGPUCount}
          setTotalNetCost={setTotalNetCost}
          totalNetworkConsumption={totalNetworkConsumption}
          setTotalNetworkConsumption={setTotalNetworkConsumption}
        />
      </div>
      <div className="w-7/8 bg-white pb-10 rounded-2xl relative">
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="p-4 font-bold w-full text-left">
              POWER DISTRIBUTION AND COOLING INFRASTRUCTURE
            </div>
            <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] mr-[5px] xs:ml-[-6px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
              i
            </div>
            <span
              className="z-10 display-on-hover absolute top-[-155px] xs:top-[-120px] sm:top-[-133px] md:top-[-105px] lg:top-[-83px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow"
              style={{
                width: "calc(100% - 40px)", // Full width minus 20px margin on each side
                maxWidth: "1200px", // Maximum width to match the original design
              }}
            >
              <span className="font-bold">Power Distribution Cost</span>{" "}
              represents the cost of procuring all the components necessary to
              supply the facility with power. This includes transformers, PDUs,
              power cords, connectors, power breakers, UPS systems, backup
              generators, ATS units, and more.
              <span className="font-bold"> Cooling Infrastructure</span> covers
              the cost of acquiring the components needed to cool down the
              facility, such as CRAC/CRAH systems, liquid cooling components.
              etc.
            </span>
          </div>
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
      <div className="w-7/8 bg-white pb-10 rounded-2xl relative">
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="p-4 font-bold w-full text-left">
              SOFTWARE LICENSE
            </div>
            <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] mr-[5px] xs:ml-[-6px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
              i
            </div>
            <span
              className="z-10 display-on-hover absolute top-[-130px] xs:top-[-110px] sm:top-[-117px] md:top-[-100px] lg:top-[-63px] xl:top-[-70px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow"
              style={{
                width: "calc(100% - 40px)", // Full width minus 20px margin on each side
                maxWidth: "1200px", // Maximum width to match the original design
              }}
            >
              <span className="font-bold">Software License Cost</span> refer to
              the one-time expenditure incurred from purchasing the rights to
              use various software solutions within the data center environment.
              These solutions encompass operating systems, server management
              tools, security software, and applications essential to make the
              whole data center infrastructure operational.
            </span>
          </div>
        </div>
        <SoftwareLicense
          nodeCount={totalNodeCount}
          cores={coresNumber}
          softwareCost={softwareLicenseCost}
          setSoftwareCost={setSoftwareLicenseCost}
        />
      </div>
      <div className="w-7/8 bg-white pb-10 rounded-2xl relative">
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="p-4 font-bold w-full text-left">ENERGY COST</div>
            <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] mr-[5px] xs:ml-[-6px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
              i
            </div>
            <span
              className="z-10 display-on-hover absolute top-[-130px] xs:top-[-110px] sm:top-[-117px] md:top-[-100px] lg:top-[-63px] xl:top-[-65px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow"
              style={{
                width: "calc(100% - 40px)", // Full width minus 20px margin on each side
                maxWidth: "1200px", // Maximum width to match the original design
              }}
            >
              <span className="font-bold">Energy Cost</span> encompasses the
              energy expenses incurred by the data center to operate not only
              the computing servers but also the entire supporting
              infrastructure. This includes networking equipment, cooling
              systems, backup power solutions, security systems, and office
              spaces.
            </span>
          </div>
        </div>
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
      <div className="w-7/8 bg-white pb-10 rounded-2xl relative">
        <div className="flex flex-row">
          <div className="flex flex-row items-center">
            <div className="p-4 font-bold w-full text-left">WORKFORCE</div>
            <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] mr-[5px] xs:ml-[-6px] rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
              i
            </div>
            <span
              className="z-10 display-on-hover absolute top-[-106px] xxxs:top-[-88px] xxs:top-[-70px] xs:top-[-60px] sm:top-[-65px] md:top-[-62px] lg:top-[-63px] xl:top-[-45px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow"
              style={{
                width: "calc(100% - 40px)", // Full width minus 20px margin on each side
                maxWidth: "1200px", // Maximum width to match the original design
              }}
            >
              <span className="font-bold">Workforce Cost</span> represents the
              total annual cost of the data center employees, which includes not
              only base salary but also taxes, benefits and bonuses.
            </span>
          </div>
        </div>
        <Labor
          nodeCount={totalNodeCount}
          laborCost={costOfPower}
          laborChoice={laborChoice}
          setLaborCost={setLaborCost}
          setLaborChoice={setLaborChoice}
          tcoCost={
            propertyValue +
            totalServerCost +
            totalNetCost +
            totalStorageCost +
            totalPCost
          }
        />
      </div>
      <div className="flex flex-wrap w-7/8 bg-white p-2 rounded-2xl items-center lg:text-lg justify-center px-4 ">
        <div className="flex items-center justify-center w-[500px] mt-2 h-[50px] sm:h-[70px] border-emerald-500 bg-emerald-100 border-2 font-bold py-1 px-3 rounded-lg shadow lg:mr-4 ">
          <div className="font-bold mr-1">TOTAL COST = $</div>
          {totalCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
        <div className="flex flex-row items-center justify-center w-[500px] mt-2 h-[50px] sm:h-[70px] border-amber-500 bg-amber-100 border-2 font-bold py-1 px-3 rounded-lg shadow">
          <div className="font-bold mr-1">MAX POWER CONSUMPTION = </div>
          {(
            (totalNetworkConsumption + totalServerConsumption) *
            pue
          ).toLocaleString("en-US", { maximumFractionDigits: 0 })}{" "}
          W
        </div>
      </div>
      <div className="flex flex-wrap justify-center items-center w-full">
        <div className="flex flex-col items-center xl:mr-[100px] 2xl:mr-0 mb-3">
          <h1 className="mb-3 font-bold text-lg">
            Total Cost Without Amortization ($
            {(
              totalServerCost +
              totalNetCost +
              propertyValue +
              totalPCost +
              costOfPower +
              softwareLicenseCost
            ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            )
          </h1>
          <PieChart
            serverCost={totalServerCost}
            networkCost={totalNetCost}
            buildingCost={propertyValue}
            powerAndCoolingCost={totalPCost}
            energyCost={costOfPower}
            softwareLicenseCost={softwareLicenseCost}
          />
        </div>
        <div className="flex flex-col items-center mb-3">
          <h1 className="mb-3 font-bold text-lg">
            Yearly Cost Considering Amortization ($
            {(
              totalServerCost / 4 +
              totalNetCost / 5 +
              propertyValue / 20 +
              totalPCost / 7 +
              costOfPower +
              softwareLicenseCost / 5
            ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            )
          </h1>
          <PieChart
            serverCost={totalServerCost / 4}
            networkCost={totalNetCost / 5}
            buildingCost={propertyValue / 20}
            powerAndCoolingCost={totalPCost / 7}
            energyCost={costOfPower}
            softwareLicenseCost={softwareLicenseCost / 5}
          />
        </div>
        <div className="flex flex-col items-center mb-3">
          <h1 className="mb-3 font-bold text-lg">
            Yearly Cost (w/ Salary) Considering Amortization ($
            {(
              totalServerCost / 4 +
              totalNetCost / 5 +
              propertyValue / 20 +
              totalPCost / 7 +
              costOfPower +
              softwareLicenseCost / 5 +
              laborCost
            ).toLocaleString("en-US", { maximumFractionDigits: 0 })}
            )
          </h1>
          <PieChart
            serverCost={totalServerCost / 4}
            networkCost={totalNetCost / 5}
            buildingCost={propertyValue / 20}
            powerAndCoolingCost={totalPCost / 7}
            energyCost={costOfPower}
            softwareLicenseCost={softwareLicenseCost / 5}
            laborCost={laborCost}
          />
        </div>
      </div>
    </main>
  );
}
