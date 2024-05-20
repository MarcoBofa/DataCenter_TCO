"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

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

  const priceLicense = watch("priceLicense");
  const os = watch("os");

  const suse_single = 749;
  const suse_multi = 1796;
  const redhat_vm = 879;
  const redhat_physical = 2749;
  const IBM_spectrum = 800;
  const firewalls_paloaltoPanorama = 9500;
  const IDPS = 99;

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

    setSoftwareCost(cost);
  }, [os, priceLicense, nodeCount, softwareCost, setSoftwareCost, cores]);

  return (
    <div className="flex flex-wrap items-center w-full">
      <div className="flex flex-col space-y-1 w-full xs:w-[350px] mb-2 p-4 mr-[40px]">
        <label className="block text-sm" htmlFor="os">
          Operating System
        </label>
        <select
          {...register("os")}
          className="max-w-[350px] xs:flex-grow p-2 rounded border-gray border-2 mb-2"
          id="os"
        >
          <option value="suse">SUSE Linux Enterprise Server</option>
          <option value="rh_vm">Red Hat for Virtual Datacenters</option>
          <option value="rh_physical">Red Hat Enterprise Linux Server</option>
          <option value="custom">Custom License</option>
        </select>
      </div>
      {os === "custom" && (
        <div className="flex flex-col space-y-1 w-full xs:w-[350px] mb-2 mr-[40px]">
          <label
            className="block text-sm text-center ml-5"
            htmlFor="priceLicense"
          >
            Price Per License $
          </label>
          <input
            {...register("priceLicense", { valueAsNumber: true })}
            className="max-w-[350px] xs:flex-grow p-2 rounded border-gray border-2 mb-2"
            type="number"
            step="1"
            placeholder="0"
            id="priceLicense"
          />{" "}
        </div>
      )}
      <div className="w-[400px] border-yellow-500 bg-yellow-100 border-2 font-bold py-1 px-3 rounded-lg mt-4 shadow mr-[50px]">
        Software License Cost: $
        {softwareCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
      </div>
    </div>
  );
};

export default SoftwareLicense;
