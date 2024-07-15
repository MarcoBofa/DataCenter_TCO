"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

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

const Input = styled(MuiInput)`
  width: 42px;
`;

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

  const [sliderValue, setSliderValue] = useState(0);
  const [avgCons, setAvgCons] = useState(0);

  const onSubmit = (data: LocalProps) => {
    // Here you would send the data to the backend
    console.log(data);
  };

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

  const usage = watch("usage");
  const choice = watch("choice");
  const eCost = watch("eCost");

  const electricityCost = 0.11;
  const spue = 1.1;

  useEffect(() => {
    let cost = 0;

    let avgCons =
      serverConsumption * (usage ? usage / 100 : 0.7) +
      serverConsumption * 0.4 * (1 - (usage ? usage / 100 : 0.3));

    cost =
      ((eCost * 30 * 24 * 12) / 1000) * pue * (spue * avgCons + netConsumption);

    cost = cost * (1 + sliderValue / 100);

    setCostOfPower(cost);
    setAvgCons(avgCons);
  }, [
    pue,
    netConsumption,
    serverConsumption,
    nodeCount,
    costOfPower,
    usage,
    choice,
    eCost,
    sliderValue,
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
      <div className="flex w-full flex-wrap text-center justify-center ">
        <div className="w-full sm:w-[400px] border-lime-500 bg-lime-100 border-2 font-bold py-1 px-4 rounded-lg mt-4 shadow md:mr-5">
          Energy Cost (Year): $
          {costOfPower.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
        <div className="flex flex-row w-full sm:w-[520px] border-fuchsia-500 bg-fuchsia-100 border-2 font-bold py-1 px-4 rounded-lg mt-4 shadow md:mr-5 justify-center items-center relative">
          <div>
            Server Average & Peak Consumption:{" "}
            {(avgCons * spue).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            W - {"  "}
            {(serverConsumption * spue).toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}{" "}
            W
          </div>
          <div className="flex hoverable-button justify-center items-center w-[13px] h-[13px] ml-3 rounded-full bg-gray-200 text-xs leading-none cursor-pointer">
            i
          </div>
          <span
            className="z-10 display-on-hover absolute top-[-130px] xs:top-[-110px] sm:top-[-117px] md:top-[-50px] lg:top-[-50px] xl:top-[-50px] left-0 right-0 mx-auto p-2 text-white bg-gray-400 text-xs sm:text-sm rounded-lg shadow"
            style={{
              width: "calc(90%)", // Full width minus 20px margin on each side
              maxWidth: "1200px", // Maximum width to match the original design
            }}
          >
            To be modified
          </span>
        </div>

        <div className="w-full sm:w-[400px] border-teal-500 bg-teal-100 border-2 font-bold py-1 px-4 rounded-lg mt-4 shadow">
          Total Average Consumption:{" "}
          {((spue * avgCons + netConsumption) * pue).toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}{" "}
          W
        </div>
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[700px] mb-2 mt-4 sm:mr-[50px] ml-4 items-center mr-4">
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

export default PowerCost;
