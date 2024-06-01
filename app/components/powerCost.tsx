"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface LocalProps {
  usage: number;
  choice: string;
  eCost: number;
}

interface powerProps {
  tier: number;
  netConsumption: number;
  serverConsumption: number;
  nodeCount: number;
  costOfPower: number;
  pue: number;
  setCostOfPower: (value: number) => void;
}

const PowerCost: React.FC<powerProps> = ({
  tier,
  netConsumption,
  serverConsumption,
  nodeCount,
  costOfPower,
  pue,
  setCostOfPower,
}) => {
  const { register, handleSubmit, watch } = useForm<LocalProps>({
    defaultValues: {
      usage: 60,
      choice: "no",
      eCost: 0.11,
    },
  });

  const onSubmit = (data: LocalProps) => {
    // Here you would send the data to the backend
    console.log(data);
  };

  const usage = watch("usage");
  const choice = watch("choice");
  const eCost = watch("eCost");

  const electricityCost = 0.11;
  const spue = 1.07;

  useEffect(() => {
    let cost = 0;

    let avgCons =
      serverConsumption * (usage ? usage / 100 : 0.7) +
      serverConsumption * 0.4 * (1 - (usage ? usage / 100 : 0.3));

    cost =
      ((eCost * 30 * 24 * 12) / 1000) * pue * (spue * avgCons + netConsumption);

    setCostOfPower(cost);
  }, [
    pue,
    netConsumption,
    serverConsumption,
    nodeCount,
    costOfPower,
    usage,
    choice,
    eCost,
  ]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm text-center ml-5" htmlFor="eCost">
          Electricity cost ($/kWh)
        </label>
        <input
          {...register("eCost", { valueAsNumber: true })}
          className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
          type="number"
          step="0.01"
          placeholder="0.11"
          id="eCost"
        />{" "}
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[350px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm" htmlFor="choice">
          Do you know expected Server Peak utilization?
        </label>
        <select
          {...register("choice")}
          className="w-full sm:w-[350px] p-2 rounded border-gray border-2 mb-2"
          id="choice"
        >
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
      {choice === "yes" && (
        <div className="flex flex-col space-y-1 w-full sm:w-[300px] mb-2 p-4 sm:mr-[40px]">
          <label className="block text-sm text-center ml-5" htmlFor="usage">
            Expected Peak Server Utilization (%)
          </label>
          <input
            {...register("usage", { valueAsNumber: true })}
            className="w-full sm:w-[300px] p-2 rounded border-gray border-2 mb-2"
            type="number"
            step="1"
            placeholder="60%"
            id="pue"
          />{" "}
        </div>
      )}
      <div className="sm:w-[400px] w-full border-fuchsia-500 bg-fuchsia-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow ml-4 mr-4 sm:mr-[50px]">
        Energy Cost (Year): $
        {costOfPower.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

export default PowerCost;
