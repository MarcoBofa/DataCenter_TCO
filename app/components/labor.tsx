"use client";
import "@/app/globals.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  SALARIES,
  Role,
  ADDITIONAL_COST_PERCENTAGES,
} from "../constants/costants";
import toast from "react-hot-toast";

interface localProps {
  choice: string;
  include: boolean;
}

interface laborProps {
  nodeCount: number;
  tcoCost: number;
  laborCost: number;
  laborChoice: boolean;
  setLaborCost: (cost: number) => void;
  setLaborChoice: (choice: boolean) => void;
}

const Labor: React.FC<laborProps> = ({
  nodeCount,
  tcoCost,
  laborCost,
  laborChoice,
  setLaborCost,
  setLaborChoice,
}) => {
  const { register, watch } = useForm<localProps>({
    defaultValues: {
      include: false,
      choice: "guided",
    },
  });

  const [totalBaseLaborCost, setTotalBaseLaborCost] = useState(0);
  const [totalLaborCost, setTotalLaborCost] = useState(0);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [selectedRoles, setSelectedRoles] = useState<{
    [key in Role]?: number;
  }>({});

  const choice = watch("choice");
  const include = watch("include");

  useEffect(() => {
    let baseCost = 0;
    let totalCost = 0;
    let totalEmp = 0;

    if (choice === "custom") {
      Object.keys(selectedRoles).forEach((role) => {
        for (const category in SALARIES) {
          if (role in SALARIES[category as keyof typeof SALARIES]) {
            const salaryString = SALARIES[category as keyof typeof SALARIES][
              role as keyof (typeof SALARIES)[keyof typeof SALARIES]
            ] as string;
            const salary = parseFloat(salaryString.replace(/[^0-9.-]+/g, ""));
            const additionalCostPercentage =
              ADDITIONAL_COST_PERCENTAGES[role as Role] || 0;
            const totalRoleCost = salary * (1 + additionalCostPercentage);
            const numEmployees = selectedRoles[role as Role] || 0;
            baseCost += salary * numEmployees;
            totalCost += totalRoleCost * numEmployees;
            totalEmp += numEmployees;
          }
        }
      });
    } else {
      let tmp = tcoCost / 5;

      let baseEmployees = 5;
      const additionalEmployeesPer100Nodes = 2;
      const additionalEmployees =
        Math.ceil(nodeCount / 100) * additionalEmployeesPer100Nodes;

      totalEmp = baseEmployees + additionalEmployees;

      baseCost = totalEmp * 110000;

      let tmp_cost = baseCost * 1.25;

      if (tmp_cost / tmp > 0.5) {
        totalEmp = Math.ceil(tmp / (150000 * 1.25));
        baseCost = 110000 * totalEmp;
        tmp_cost = totalEmp * (110000 * 1.25);
      }

      totalCost = tmp_cost;

      if (totalEmp < 5) {
        totalEmp = 5;
        baseCost = 110000 * totalEmp;
        totalCost = totalEmp * 110000 * 1.25;
      }
    }

    setLaborChoice(include);
    setTotalBaseLaborCost(baseCost);
    setTotalLaborCost(totalCost);
    setTotalEmployees(totalEmp);
    setLaborCost(totalCost);
  }, [
    selectedRoles,
    nodeCount,
    setLaborCost,
    include,
    setLaborChoice,
    tcoCost,
    choice,
  ]);

  const handleRoleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const role = event.target.value as Role;
    if (role && !(role in selectedRoles)) {
      setSelectedRoles({ ...selectedRoles, [role]: 0 });
    }
  };

  const handleEmployeeNumChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    role: Role
  ) => {
    let num = parseInt(event.target.value, 10);
    if (num < 0) {
      num = 0;
      toast.error("Number of employees cannot be negative");
    }
    setSelectedRoles({ ...selectedRoles, [role]: num });
  };

  const handleRemoveRole = (role: Role) => {
    const updatedRoles = { ...selectedRoles };
    delete updatedRoles[role];
    setSelectedRoles(updatedRoles);
  };

  return (
    <div className="flex flex-wrap items-center w-full p-4">
      <div className="flex flex-wrap items-center space-y-4 sm:space-y-0 mb-4 w-full">
        <div className="flex flex-col space-y-1 w-full sm:w-[250px] sm:mr-[15px]">
          <label className="block text-sm" htmlFor="include">
            Include in Total Cost?
          </label>
          <select
            {...register("include")}
            className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
            id="include"
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[250px] sm:mr-[15px]">
          <label className="block text-sm" htmlFor="choice">
            Estimation
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
        <div className="flex flex-col space-y-1 w-full sm:w-[250px] min-w-[100px] sm:mr-[15px] rounded">
          <label className="block text-sm h-[40px] border-gray-00 border-2 pt-2 mt-[23px]">
            Total Employees: {totalEmployees}
          </label>
        </div>
        {choice === "custom" && (
          <>
            <div className="flex flex-col space-y-1 w-full sm:w-[250px]">
              <label className="block text-sm" htmlFor="role">
                Select a role
              </label>
              <select
                className="w-full sm:w-[250px] p-2 rounded border-gray border-2 mb-2"
                id="role"
                onChange={handleRoleChange}
              >
                <option value="">-- Select a role --</option>
                {Object.entries(SALARIES).map(([category, roles]) => (
                  <optgroup key={category} label={category}>
                    {Object.keys(roles).map((role) => (
                      <option key={role} value={role}>
                        {(role as string).replace(/_/g, " ").toLowerCase()}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </>
        )}
      </div>
      {choice === "custom" && (
        <div className="w-full flex flex-wrap">
          {Object.keys(selectedRoles).map((role) => (
            <div
              key={role}
              className="flex items-center justify-between mb-4 p-4 border rounded-lg bg-gray-100 w-full sm:w-[calc(50%-1rem)] sm:mr-4 last:mr-0"
            >
              <div className="flex flex-col space-y-1 w-2/3">
                <label
                  className="block text-sm"
                  htmlFor={`employeeNum-${role}`}
                >
                  Number of{" "}
                  <span className="font-bold">
                    {(role as string).replace(/_/g, " ").toLowerCase()}
                  </span>
                  :
                </label>
                <input
                  className="w-full p-2 rounded border-gray border-2"
                  type="number"
                  step="1"
                  value={selectedRoles[role as Role] || 0}
                  onChange={(e) => handleEmployeeNumChange(e, role as Role)}
                  placeholder="0"
                  id={`employeeNum-${role}`}
                />
              </div>
              <button
                className="ml-4 p-2 bg-red-500 hover:bg-red-700 text-white rounded"
                onClick={() => handleRemoveRole(role as Role)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex w-full flex-wrap text-center justify-center ">
        <div className="w-full sm:w-[400px] border-cyan-500 bg-cyan-100 border-2 font-bold py-2 px-4 rounded-lg mt-4 shadow md:mr-5">
          Total (Base salary) Labor Cost: $
          {totalBaseLaborCost.toLocaleString("en-US", {
            maximumFractionDigits: 0,
          })}
        </div>
        <div className="w-full sm:w-[400px] border-green-500 bg-green-100 border-2 font-bold py-2 px-4 rounded-lg mt-4 shadow">
          Total Compensation Cost: $
          {totalLaborCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
      </div>
    </div>
  );
};

export default Labor;
