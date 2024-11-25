"use client";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";

interface localProps {
  mode: string;
  price: number;
  type: string;
  amount: number;
}

interface StorageProps {
  index: string;
  storage: number;
  modeProp?: "custom" | "guided";
  typeProp?: "sata" | "nvme" | "hdd" | "tape";
  priceProp?: number;
  updateStorageClusterCost: (index: string, totalCost: number) => void;
  updateStorageAmount: (index: string, storage: number) => void;
  updateStorageNodeConsumption: (index: string, consumption: number) => void;
}

const Storage: React.FC<StorageProps> = ({
  index,
  storage,
  modeProp,
  priceProp,
  typeProp,
  updateStorageClusterCost,
  updateStorageAmount,
  updateStorageNodeConsumption,
}) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<localProps>({
    defaultValues: {
      mode: modeProp || "guided",
      price: priceProp || 0,
      type: typeProp || "hdd",
      amount: storage ? storage : 10,
    },
  });

  const [storageCost, setStorageCost] = useState(0);

  const watchedFields = watch();
  const mode = watch("mode");
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

  const inputCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof localProps,
    min: number
  ) => {
    const value = Number(event.target.value);
    setValue(field, value < min ? min : value, { shouldValidate: true });
  };

  useEffect(() => {
    let cost = 0;

    switch (type) {
      case "nvme": {
        cost += amount * 1000 * high_SSD;
        break;
      }
      case "sata": {
        cost += amount * 1000 * low_SSD;
        break;
      }
      case "hdd": {
        cost += amount * high_hdd;
        break;
      }
      case "tape": {
        cost += amount * low_hdd;
        break;
      }
    }

    if (mode === "custom") {
      cost = amount * price;
    }

    setStorageCost(cost);
    let consumption = storageConsumption * amount;

    updateStorageAmount(index, amount);
    updateStorageClusterCost(index, cost);
    updateStorageNodeConsumption(index, consumption);
  }, [mode, amount, type, price]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm" htmlFor="mode">
          Selection
        </label>
        <select
          {...register("mode")}
          className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
          id="mode"
        >
          <option value="guided">Guided</option>
          <option value="custom">Customizable</option>
        </select>
      </div>
      {mode == "custom" && (
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
          <option value="hdd">High Performance HDD</option>
          <option value="tape">Low Performance HDD</option>
          <option value="nvme">SSD NVMe</option>
          <option value="sata">SSD SATA</option>
        </select>
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[250px] mb-2 p-4 sm:mr-[40px]">
        <label className="block text-sm text-center ml-5" htmlFor="amount">
          Storage amount (TB)
        </label>
        <input
          {...register("amount", {
            valueAsNumber: true,
            validate: (value) => value > 0 || "Storage must be more than 0",
          })}
          className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
          type="number"
          step="1"
          placeholder="10TB"
          id="amount"
          min="1"
          onChange={(event) => inputCheck(event, "amount", 1)}
        />
        {errors.amount && (
          <span className="font-bold text-red-500">
            {" "}
            {errors.amount.message}
          </span>
        )}
      </div>
      <div className="sm:w-[400px] w-full border-cyan-500 bg-cyan-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow ml-4 mr-4 sm:mr-[50px]">
        Storage Cost: $
        {storageCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

export default Storage;
