"use client";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import { useTCO } from "../context/useContext";
import debounce from "lodash/debounce";

interface LocalProps {
  pue: number;
  cooling: "liquid" | "air";
}

const Input = styled(MuiInput)`
  width: 42px;
`;

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
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LocalProps>({
    defaultValues: {
      pue: 1.35,
      cooling: "liquid",
    },
  });

  const [sliderValue, setSliderValue] = useState(0);
  const { powerDistributionAndCooling, setPowerDistributionAndCooling } =
    useTCO();

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
  const transformerCostPerKVA = 150; // Example cost per kVA

  const CRAH = 2000;
  const chillers = 1000;
  const tonCooling = 3.517;
  const coolingTowers = 200;
  const otherCoolingCost = 150;

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
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

  const inputCheck = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof LocalProps
  ) => {
    const value = Number(event.target.value);
    setValue(field, value < 1 ? 1 : value, { shouldValidate: true });
  };

  const debouncedSetPowerDistributionAndCooling = useCallback(
    debounce((newValues: any) => {
      setPowerDistributionAndCooling(newValues);
    }, 300), // 300ms delay; adjust as needed
    [setPowerDistributionAndCooling]
  );

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
          Math.ceil((totalConsumption * 1 * pue) / 150000) * generatorPrice150 +
          ATSprice;
        cost +=
          Math.ceil((totalConsumption * 1) / 50000) * upsPrice50 +
          Math.ceil((totalConsumption * 1) / 17300) * smartPduPrice17;
        break;
      }
      case 3: {
        cost +=
          Math.ceil((totalConsumption * 1.3 * pue) / 150000) *
            (generatorPrice150 + ATSprice) +
          Math.ceil((totalConsumption * 1.3) / 50000) * upsPrice50 +
          Math.ceil((totalConsumption * 1.3) / 17300) * smartPduPrice17;

        break;
      }
      case 4: {
        cost +=
          Math.ceil((totalConsumption * 1.6 * pue) / 150000) *
            (generatorPrice150 + ATSprice) +
          Math.ceil((totalConsumption * 1.6) / 50000) * upsPrice50 +
          Math.ceil((totalConsumption * 1.6) / 17300) * smartPduPrice17;
        break;
      }
    }

    if (cooling == "liquid") {
      cost = (totalConsumption / 1000) * 1600;
    }

    const load =
      (totalConsumption - totalConsumption * (pue - 1)) / 1000 / tonCooling;

    cost +=
      load * chillers +
      load * coolingTowers +
      load * CRAH +
      load * otherCoolingCost;

    // Calculate kVA
    const kVA = totalConsumption / 0.9 / 1000;

    // Calculate transformer cost
    const transformerCost = kVA * transformerCostPerKVA;
    cost += transformerCost;

    cost = cost * (1 + sliderValue / 100);

    //debouncedSetPowerDistributionAndCooling({ pue, cooling });

    setPDcost(cost);
    setPueValue(pue);
  }, [pue, cooling, pdCost, tier, totalConsumption, sliderValue]);

  useEffect(() => {
    if (
      powerDistributionAndCooling.pue !== pue ||
      powerDistributionAndCooling.cooling !== cooling
    ) {
      reset({
        pue: powerDistributionAndCooling.pue || 1.35,
        cooling: powerDistributionAndCooling.cooling || "liquid",
      });
    }
  }, [powerDistributionAndCooling, reset]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full md:w-[320px] md:mb-2 p-4 md:mr-[40px]">
        <label className="block text-sm text-center ml-5" htmlFor="pue">
          Desired Power Usage Effectives (PUE)
        </label>
        <input
          {...register("pue", {
            valueAsNumber: true,
            validate: (value) =>
              value > 0.99 || "PUE should not be lower than 1",
          })}
          className={`md:w-[320px] w-full p-2 rounded ${
            errors.pue ? "border-red-500" : "border-gray-200"
          } border-2 mb-2`}
          type="number"
          step="0.01"
          placeholder="1.35"
          id="pue"
          min="1"
          onChange={(event) => inputCheck(event, "pue")}
        />
        {errors.pue && (
          <span className="font-bold text-red-500">
            {" "}
            &#x274C; {errors.pue.message}
          </span>
        )}
      </div>
      <div className="flex flex-col space-y-1 w-full md:w-[250px] p-4 mb-2 md:mr-[40px]">
        <label className="block text-sm" htmlFor="cooling">
          Cooling
        </label>
        <select
          {...register("cooling")}
          className="w-full md:w-[250px] p-2 rounded border-gray border-2 mb-2 md:mr-[40px]"
          id="cooling"
        >
          <option value="liquid">Liquid</option>
          <option value="air">Air</option>
        </select>
      </div>
      <div className="w-full md:w-[610px] xl:w-[450px] border-cyan-500 bg-cyan-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow ml-4 mr-4 md:mr-[10px]">
        Power Distribution & Cooling cost: $
        {pdCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[700px] mb-2 mt-7 sm:mr-[50px] ml-4 items-center mr-4">
        <Box sx={{ width: "100%" }}>
          <Typography id="input-slider" gutterBottom>
            Adjust Cost ({sliderValue}%)
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item></Grid>
            <Grid item xs>
              <Slider
                value={typeof sliderValue === "number" ? sliderValue : 0}
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
              <Input
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
  );
};

export default PowerDistribution;
