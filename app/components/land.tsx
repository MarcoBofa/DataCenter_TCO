"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

interface LocalProps {
  mode: string;
  ft: number;
  cap: number;
  powerRating: number;
  rentalRate: number;
  occupancy: number;
  GOI: number;
  propertyValue: number;
}

interface LandProps {
  homePropertyValue: number;
  setPropertyValue: (value: number) => void;
}

const Land: React.FC<LandProps> = ({
  homePropertyValue,
  setPropertyValue,
}: {
  homePropertyValue: number;
  setPropertyValue: (value: number) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LocalProps>({
    defaultValues: {
      mode: "Guided",
      ft: 10,
      cap: 9,
      powerRating: 2.5,
      rentalRate: 150,
      occupancy: 60,
      GOI: 30,
      propertyValue: 1,
    },
  });

  const onSubmit = (data: LocalProps) => {
    // Here you would send the data to the backend
    console.log(data);
  };

  const ft = watch("ft");
  const cap = watch("cap");
  const powerRating = watch("powerRating");
  const rentalRate = watch("rentalRate");
  const occupancy = watch("occupancy");

  const GOI = (rentalRate * powerRating * 1000) / (ft * 1000);

  const propertyValue = (GOI * ft * 1000 * (occupancy / 100)) / (cap / 100);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: keyof LocalProps
  ) => {
    const value = Number(event.target.value);
    setValue(field, value < 0 ? 0 : value, { shouldValidate: true });
  };

  useEffect(() => {
    setPropertyValue(propertyValue);
  }, [propertyValue]);

  return (
    <div className="flex flex-col space-y-3 p-4">
      <div className="flex flex-wrap items-center w-full">
        <select
          {...register("mode")}
          className="w-full sm:w-[200px] p-2 rounded border-gray border-2 mb-3 sm:mr-[50px]"
        >
          <option value="Guided">Guided</option>
          <option value="Customizable">Customizable</option>
        </select>
        <div className="w-full sm:w-[285px] border-sky-500 bg-sky-100 text-center border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
          GOI: {GOI.toFixed(1)} $/ft^2
        </div>
        <div className="w-[450px] border-indigo-500 text-center bg-indigo-100 border-2 font-bold py-1 px-3 rounded-lg shadow mb-2 sm:mr-[50px]">
          Property Value: $
          {propertyValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
        </div>
      </div>

      <div className="flex flex-wrap items-center w-full">
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="ft">
            Square Footage (kft^2)
          </label>
          <input
            {...register("ft", {
              valueAsNumber: true,
              validate: (value) =>
                value > 0 || "Square footage must be higher than 0",
            })}
            className={`flex-grow p-2 rounded border-2 ${
              errors.ft ? "border-red-500" : "border-gray-200"
            }`}
            type="number"
            placeholder="1"
            id="ft"
            min="0"
            onChange={(event) => handleInputChange(event, "ft")}
          />
          {errors.ft && (
            <span className="text-red-500 font-bold">
              &#x274C; {errors.ft.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="occupancy">
            Occupancy (%)
          </label>
          <input
            {...register("occupancy", {
              valueAsNumber: true,
              validate: (value) =>
                value > 0 || "Occupancy must be higher than 0",
            })}
            className={`flex-grow p-2 rounded border-2 ${
              errors.occupancy ? "border-red-500" : "border-gray-200"
            }`}
            type="number"
            placeholder="60"
            id="occupancy"
            min="0"
            onChange={(event) => handleInputChange(event, "occupancy")}
          />
          {errors.occupancy && (
            <span className="text-red-500 font-bold">
              &#x274C; {errors.occupancy.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="powerRating">
            Power Rating Facility (MW)
          </label>
          <input
            {...register("powerRating", {
              valueAsNumber: true,
              validate: (value) =>
                value > 0 || "Power Rating must be higher than 0",
            })}
            className={`flex-grow p-2 rounded border-2 ${
              errors.powerRating ? "border-red-500" : "border-gray-200"
            }`}
            type="number"
            step="0.1"
            placeholder="2.5"
            id="powerRating"
            min="0"
            onChange={(event) => handleInputChange(event, "powerRating")}
          />
          {errors.powerRating && (
            <span className="text-red-500 font-bold">
              &#x274C; {errors.powerRating.message}
            </span>
          )}
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="rentalRate">
            Rental Rates ($Kw/mo)
          </label>
          <input
            {...register("rentalRate", { valueAsNumber: true })}
            className={`flex-grow p-2 rounded border-2 ${
              errors.rentalRate ? "border-red-500" : "border-gray-200"
            }`}
            type="number"
            placeholder="1"
            id="rentalRate"
            min="0"
            onChange={(event) => handleInputChange(event, "rentalRate")}
          />
        </div>
        <div className="flex flex-col space-y-1 w-full sm:w-[200px] mb-2 sm:mr-[50px]">
          <label className="block text-sm" htmlFor="cap">
            Cap Rate
          </label>
          <input
            {...register("cap", {
              valueAsNumber: true,
              validate: (value) => value > 0 || "Cap must be higher than 0",
            })}
            className={`flex-grow p-2 rounded border-2 ${
              errors.cap ? "border-red-500" : "border-gray-200"
            }`}
            type="number"
            placeholder="8"
            id="cap"
            min="0"
            onChange={(event) => handleInputChange(event, "cap")}
          />
          {errors.cap && (
            <span className="text-red-500 font-bold">
              &#x274C; {errors.cap.message}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Land;
