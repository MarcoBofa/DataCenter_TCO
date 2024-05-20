"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface LocalProps {
  pue: number;
  cooling: string;
}

interface powerProps {
  homePue: number;
  tier: number;
  totalConsumption: number;
  pdCost: number;
  setPDcost: (value: number) => void;
  setPueValue: (value: number) => void;
}

const PowerDistribution: React.FC<powerProps> = ({
  homePue,
  tier,
  totalConsumption,
  pdCost,
  setPDcost,
  setPueValue,
}) => {
  const { register, handleSubmit, watch } = useForm<LocalProps>({
    defaultValues: {
      pue: 1.35,
      cooling: "liquid",
    },
  });

  const onSubmit = (data: LocalProps) => {
    // Here you would send the data to the backend
    console.log(data);
  };

  const pue = watch("pue");
  const cooling = watch("cooling");

  const generatorPrice150 = 37500;
  const upsPrice50 = 28000;
  const smartPduPrice17 = 3300;
  const ATSprice = 1189;

  useEffect(() => {
    let cost = 0;

    switch (tier) {
      case 1: {
        cost +=
          Math.floor((totalConsumption * 1 * pue) / 150000) *
            generatorPrice150 +
          ATSprice;
        if (cost == 0) {
          cost += 10000;
        }
        cost +=
          Math.floor((totalConsumption * 1) / 50000) * upsPrice50 +
          Math.floor((totalConsumption * 1) / 17300) * smartPduPrice17;
        break;
      }
      case 2: {
        cost +=
          Math.ceil((totalConsumption * 0.9 * pue) / 150000) *
            generatorPrice150 +
          ATSprice;
        cost +=
          Math.ceil((totalConsumption * 0.9) / 50000) * upsPrice50 +
          Math.ceil((totalConsumption * 0.9) / 17300) * smartPduPrice17;
        break;
      }
      case 3: {
        cost +=
          Math.ceil((totalConsumption * 1.25 * pue) / 150000) *
            (generatorPrice150 + ATSprice) +
          Math.ceil((totalConsumption * 1.25) / 50000) * upsPrice50 +
          Math.ceil((totalConsumption * 1.25) / 17300) * smartPduPrice17;

        break;
      }
      case 4: {
        cost +=
          Math.ceil((totalConsumption * 1.5 * pue) / 150000) *
            (generatorPrice150 + ATSprice) +
          Math.ceil((totalConsumption * 1.5) / 50000) * upsPrice50 +
          Math.ceil((totalConsumption * 1.5) / 17300) * smartPduPrice17;
        break;
      }
    }

    if (cooling == "liquid") {
      cost = (totalConsumption / 1000) * 1500;
    }

    setPDcost(cost);
    setPueValue(pue);
  }, [pue, cooling, pdCost, tier, totalConsumption]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full xs:w-[350px] mb-2 p-4 mr-[40px]">
        <label className="block text-sm text-center ml-5" htmlFor="pue">
          Desired Power Usage Effectives (PUE)
        </label>
        <input
          {...register("pue", { valueAsNumber: true })}
          className="max-w-[350px] xs:flex-grow p-2 rounded border-gray border-2 mb-2"
          type="number"
          step="0.01"
          placeholder="1.35"
          id="pue"
        />
      </div>
      <div className="flex flex-col space-y-1 w-full xs:w-[250px] mb-2 mr-[40px]">
        <label className="block text-sm" htmlFor="cooling">
          Cooling
        </label>
        <select
          {...register("cooling")}
          className="max-w-[250px] xs:flex-grow p-2 rounded border-gray border-2 mb-2"
          id="cooling"
        >
          <option value="liquid">Liquid</option>
          <option value="Air">Air</option>
        </select>
      </div>
      <div className="w-[450px] border-cyan-500 bg-cyan-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow mr-[50px]">
        Power Distribution & Cooling cost: $
        {pdCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

export default PowerDistribution;
