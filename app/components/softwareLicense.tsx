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
  priceLicense: number;
  os: string;
}

interface softwareProps {
  nodeCount: number;
  softwareCost: number;
  cores: number;
  setSoftwareCost: (value: number) => void;
}

const Input = styled(MuiInput)`
  width: 42px;
`;

const SoftwareLicense: React.FC<softwareProps> = ({
  nodeCount,
  softwareCost,
  setSoftwareCost,
  cores,
}) => {
  const { register, handleSubmit, watch } = useForm<LocalProps>({
    defaultValues: {
      priceLicense: 0,
      os: "suse",
    },
  });

  const onSubmit = (data: LocalProps) => {
    // Here you would send the data to the backend
    console.log(data);
  };

  const [sliderValue, setSliderValue] = useState(0);

  const priceLicense = watch("priceLicense");
  const os = watch("os");

  const suse_single = 749;
  const suse_multi = 1796;
  const redhat_vm = 879;
  const redhat_physical = 2749;
  const IBM_spectrum = 800;
  const firewalls_paloaltoPanorama = 9500;
  const IDPS = 99;

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

  useEffect(() => {
    let cost = 0;

    if (os === "custom") {
      cost += nodeCount * priceLicense;
    } else if (os === "suse") {
      if (cores / nodeCount > 18) {
        cost += nodeCount * suse_multi;
      } else {
        cost += nodeCount * suse_single;
      }
    } else if (os === "rh_vm") {
      cost += nodeCount * redhat_vm;
    } else {
      cost += nodeCount * redhat_physical;
    }

    if (os != "custom") {
      if (nodeCount >= 50 && nodeCount <= 100) {
        cost = cost * 0.9;
        cost += nodeCount * 32 + firewalls_paloaltoPanorama;
      } else if (nodeCount > 100 && nodeCount <= 300) {
        cost = cost * 0.8;
        cost += nodeCount * 28 + firewalls_paloaltoPanorama;
      } else if (nodeCount > 300 && nodeCount <= 500) {
        cost = cost * 0.7;
        cost += nodeCount * 23 + firewalls_paloaltoPanorama;
      } else if (nodeCount > 500) {
        cost = cost * 0.6;
        cost += 17500 + firewalls_paloaltoPanorama * 2;
      }
    }

    cost += IBM_spectrum * nodeCount + IDPS + nodeCount;

    cost = cost * (1 + sliderValue / 100);

    setSoftwareCost(cost);
  }, [
    os,
    priceLicense,
    nodeCount,
    softwareCost,
    setSoftwareCost,
    cores,
    sliderValue,
  ]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full md:w-[310px] mb-2 p-4 md:mr-[40px] justify-center">
        <label className="block text-sm" htmlFor="os">
          Operating System
        </label>
        <select
          {...register("os")}
          className="w-full md:w-[310px] p-2 rounded border-gray border-2 mb-2"
          id="os"
        >
          <option value="suse">SUSE Linux Enterprise Server</option>
          <option value="rh_vm">Red Hat for Virtual Datacenters</option>
          <option value="rh_physical">Red Hat Enterprise Linux Server</option>
          <option value="custom">Custom License</option>
        </select>
      </div>
      {os === "custom" && (
        <div className="flex flex-col space-y-1 w-full md:w-[350px] mb-2 p-4 md:mr-[40px]">
          <label
            className="block text-sm text-center ml-5"
            htmlFor="priceLicense"
          >
            Price Per Node $
          </label>
          <input
            {...register("priceLicense", { valueAsNumber: true })}
            className="w-full md:w-[350px] p-2 rounded border-gray border-2 mb-2"
            type="number"
            step="1"
            placeholder="0"
            id="priceLicense"
          />{" "}
        </div>
      )}
      <div className="md:w-[400px] w-full border-yellow-500 bg-yellow-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow ml-4 mr-4 md:mr-[10px]">
        Software License Cost: $
        {softwareCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
      <div className="flex flex-col space-y-1 w-full sm:w-[700px] mb-2 mt-7 xl:mr-[200px] ml-4 items-center mr-4">
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

export default SoftwareLicense;
