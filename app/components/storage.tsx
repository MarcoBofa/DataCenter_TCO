"use client";
import "@/app/globals.css";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

interface localProps {
  choice: string;
  price: number;
  type: string;
  amount: number;
}

interface StorageProps {
  index: string;
  nodeCount: number;
  updateStorageClusterCost: (index: string, totalCost: number) => void;
  updateStorageAmount: (index: string, storage: number) => void;
  updateStorageNodeConsumption: (index: string, consumption: number) => void;
}

const Storage: React.FC<StorageProps> = ({
  index,
  nodeCount,
  updateStorageClusterCost,
  updateStorageAmount,
  updateStorageNodeConsumption,
}) => {
  const { control, register, watch } = useForm<localProps>({
    defaultValues: {
      choice: "guided",
      price: 0,
      type: "hdd_high",
    },
  });

  const [storageCost, setStorageCost] = useState(0);

  const watchedFields = watch();
  const choice = watch("choice");
  const price = watch("price");
  const type = watch("type");
  const amount = watch("amount");

  const cost_gb_mem = 10;
  const cost_rack = 1700;
  const low_SSD = 0.1;
  const mid_SSD = 0.3;
  const high_SSD = 0.55;
  const low_hdd = 20;
  const high_hdd = 28;
  const storageConsumption = 5;
  const psu_800w = 800;

  useEffect(() => {
    let cost = 0;

    switch (type) {
      case "ssd_high": {
        cost += amount * 1000 * high_SSD;
        break;
      }
      case "ssd_low": {
        cost += amount * 1000 * low_SSD;
        break;
      }
      case "hdd_high": {
        cost += amount * high_hdd;
        break;
      }
      case "hdd_low": {
        cost += amount * low_hdd;
        break;
      }
    }

    if (choice === "custom") {
      cost = amount * price;
    }

    setStorageCost(cost);
    let consumption = storageConsumption * amount;

    updateStorageAmount(index, amount);
    updateStorageClusterCost(index, cost);
    updateStorageNodeConsumption(index, consumption);
  }, [choice, amount, type, price]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm" htmlFor="choice">
          Selection
        </label>
        <select
          {...register("choice")}
          className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
          id="choice"
        >
          <option value="guided">Guided</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      {choice == "custom" && (
        <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
          <label className="block text-sm text-center ml-5" htmlFor="price">
            Price per TB
          </label>
          <input
            {...register("price", { valueAsNumber: true })}
            className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
            type="number"
            step="1"
            placeholder="$/GB"
            id="price"
          />{" "}
        </div>
      )}

      <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm text-center ml-5" htmlFor="type">
          Type of Storage
        </label>
        <select
          {...register("type")}
          className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
          id="type"
        >
          <option value="hdd_high">High Performance HDD</option>
          <option value="hdd_low">Low Performance HDD</option>
          <option value="ssd_high">SSD NVMe</option>
          <option value="ssd_low">SSD SATA</option>
        </select>
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm text-center ml-5" htmlFor="amount">
          Storage amount (TB)
        </label>
        <input
          {...register("amount", { valueAsNumber: true })}
          className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
          type="number"
          step="1"
          placeholder="10TB"
          id="amount"
        />{" "}
      </div>
      <div className="sm:w-[400px] w-full border-cyan-500 bg-cyan-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow ml-4 mr-4 sm:mr-[50px]">
        Storage Cost: $
        {storageCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

export default Storage;
