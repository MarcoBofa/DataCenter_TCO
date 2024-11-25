import React, { useState } from "react";
import "../app/globals.css";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import CodeBlock from "@/app/components/codeBlock";
import { tcoSchema } from "@/app/schemas/schema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { SALARIES } from "@/app/constants/costants";
import Link from "next/link";

const example = {
  datacenter: {
    land: {
      ft: 10,
      occupancy: 85,
      powerRating: 4.5,
      rentalRate: 190,
      cap: 15,
    },
    serverClusterJson: [
      {
        mode: "guided",
        cpu: "intel_gold",
        homeNodeCount: 20,
        processorsPerNode: 2,
        coresPerProcessor: 16,
        ramPerNode: 64,
        storagePerNode: 512,
        typeOfSSD: "high_ssd",
        gpu: "yes",
        gpu_perNode: 2,
        gpu_model: "H100",
        custom_cost_per_node: 12000,
        custom_core_per_node: 16,
      },
      {
        mode: "custom",
        homeNodeCount: 8,
        processorsPerNode: 1,
        coresPerProcessor: 8,
        ramPerNode: 32,
        storagePerNode: 256,
        typeOfSSD: "mid_ssd",
        gpu: "yes",
        gpu_perNode: 2,
        gpu_model: "A100_40",
        custom_cost_per_node: 6000,
        custom_core_per_node: 8,
      },
    ],
    storageNode: [
      {
        mode: "guided",
        type: "nvme",
        amount: 25,
        price: 1.8,
      },
      {
        mode: "custom",
        type: "sata",
        amount: 12,
        price: 1.3,
      },
    ],
    network: {
      provider: "infiniband",
      tier: 3,
      bandwidth: 200,
      topology: "fat-tree",
    },
    powerDistributionAndCooling: {
      pue: 1.55,
      cooling: "air",
    },
    energyCost: {
      eCost: 0.25,
      choice: "yes",
      usage: 90,
    },
    software: {
      os: "custom",
      priceLicense: 75000,
    },

    labor: {
      mode: "custom",
      workers: [
        {
          role: "SYSTEMS_ADMINISTRATORS",
          count: 6,
        },
        {
          role: "NETWORK_ENGINEER",
          count: 4,
        },
      ],
    },
  },
};

const infoUpload: React.FC = () => {
  const [showSchema, setShowSchema] = useState(true);
  const [showServerDetails, setShowServerDetails] = useState(false);
  const [showStorageDetails, setShowStorageDetails] = useState(false);
  const [showLaborDetails, setShowLaborDetails] = useState(false);

  const JsonExample = () => (
    <CodeBlock code={showSchema ? tcoSchema : example} />
  );

  const toggleMenu = () => {
    setShowSchema(!showSchema);
  };

  const toggleServerDetails = () => {
    setShowServerDetails(!showServerDetails);
  };

  const toggleStorageDetails = () => {
    setShowStorageDetails(!showStorageDetails);
  };

  const toggleLaborDetails = () => {
    setShowLaborDetails(!showLaborDetails);
  };

  const ServerConfigSection = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3 bg-slate-100 dark:bg-slate-700 p-2 rounded">
        {title}
      </h3>
      {children}
    </div>
  );

  const ConfigItem = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-4">
      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mb-2">
        {title}
      </h4>
      <div className="pl-4 text-sm text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </div>
  );

  const OptionsList = ({ options }: { options: string[] }) => (
    <ul className="ml-4 space-y-1">
      {options.map((option, index) => (
        <li key={index} className="text-slate-600 dark:text-slate-300">
          • {option}
        </li>
      ))}
    </ul>
  );

  const allRoles = Object.values(SALARIES)
    .map((category) => Object.keys(category))
    .flat();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section - Same as before */}
        <div className="text-center mb-12">
          <Link href="/">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4 hover:text-blue-900">
              Data Center TCO Calculator
            </h1>
          </Link>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Configure your data center parameters with our JSON schema
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Schema Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                      Datacenter Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Land Section */}
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                          Land
                        </h4>
                        <div className="space-y-4">
                          <ConfigItem title="Square Footage (ft)">
                            <p>• ft: Float ≥ 0 (in thousands of square feet)</p>
                          </ConfigItem>
                          <ConfigItem title="Occupancy (%)">
                            <p>• occupancy: Float between 0 and 100</p>
                          </ConfigItem>
                          <ConfigItem title="Power Rating Facility (MW)">
                            <p>• powerRating: Float ≥ 0</p>
                          </ConfigItem>
                          <ConfigItem title="Rental Rates ($/kW/mo)">
                            <p>• rentalRate: Float ≥ 0</p>
                          </ConfigItem>
                          <ConfigItem title="Cap Rate (%)">
                            <p>• cap: Float ≥ 0</p>
                          </ConfigItem>
                        </div>
                      </div>

                      {/* Improved Server Clusters Section */}
                      <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium text-slate-900 dark:text-white">
                            Server Clusters
                          </h4>
                          <button
                            className="text-blue-600 dark:text-blue-400 hover:underline text-sm focus:outline-none"
                            onClick={toggleServerDetails}
                          >
                            {showServerDetails
                              ? "Hide Details"
                              : "Show Details"}
                          </button>
                        </div>

                        {showServerDetails && (
                          <div className="space-y-6">
                            <ServerConfigSection title="Guided Mode Configuration mode:'guided'">
                              <ConfigItem title="cpu">
                                <OptionsList
                                  options={[
                                    "intel_max (Intel Xeon Max Series)",
                                    "intel_plat (Intel Xeon Platinum)",
                                    "intel_gold (Intel Xeon Gold)",
                                    "intel_sil (Intel Xeon Silver)",
                                    "amd_genoa (AMD EPYC Genoa)",
                                    "amd_genoax (AMD EPYC Genoa-X)",
                                    "amd_siena (AMD EPYC Siena)",
                                    "amd_bergamo (AMD EPYC Bergamo)",
                                  ]}
                                />
                              </ConfigItem>

                              <ConfigItem title="Node Configuration">
                                <ul className="space-y-2">
                                  <li>• homeNodeCount: Integer ≥ 1</li>
                                  <li>• processorsPerNode: 1 or 2</li>
                                </ul>
                              </ConfigItem>

                              <ConfigItem title="Processor Cores">
                                <div className="grid grid-cols-2 gap-2">
                                  {/* {[
                                    2, 4, 8, 12, 16, 24, 28, 32, 36, 42, 48, 52,
                                    56, 60, 64, 84, 96,
                                  ].map((core, index) => (
                                    <span key={index} className="text-sm">
                                      {core} cores
                                    </span>
                                  ))} */}
                                  coresPerProcessor: 2, 4, 8, 12, 16, 24, 28,
                                  32, 36, 42, 48, 52, 56, 60, 64, 84, 96
                                </div>
                              </ConfigItem>

                              <ConfigItem title="Memory Options (GB)">
                                <div className="grid grid-cols-2 gap-2">
                                  ramPerNode: 4, 8, 16, 32, 64, 96, 128, 192,
                                  256, 512, 1024, 2048
                                </div>
                              </ConfigItem>

                              <ConfigItem title="Storage Configuration">
                                <OptionsList
                                  options={[
                                    "'high_ssd' High Performance SSD",
                                    "'mid_ssd' Medium Performance SSD",
                                    "'low_ssd' Low Performance SSD",
                                  ]}
                                />
                                <p className="mt-2">
                                  storagePerNode: Integer ≥ 0 GB
                                </p>
                              </ConfigItem>

                              <ConfigItem title="GPU Configuration">
                                <p className="mb-2">gpu: "yes" or "no"</p>
                                <div className="pl-4">
                                  <p className="font-medium mb-1">
                                    When GPU enabled:
                                  </p>
                                  <p className="mb-1">
                                    gpu_perNode: 1, 2, 4, 6, or 8
                                  </p>
                                  <p className="mb-1">gpu_model:</p>
                                  <OptionsList
                                    options={[
                                      "'H100' NVIDIA H100",
                                      "'A100_40' NVIDIA A100 40GB",
                                      "'A100_80' NVIDIA A100 40GB",
                                      "'A40' NVIDIA A40",
                                      "'A30' NVIDIA A30",
                                      "'L4' NVIDIA L4",
                                      "'T4' NVIDIA T4",
                                      "'V100' NVIDIA V100",
                                    ]}
                                  />
                                </div>
                              </ConfigItem>
                            </ServerConfigSection>

                            <ServerConfigSection title="Custom Mode Configuration mode: 'custom'">
                              <ConfigItem title="Basic Configuration">
                                <ul className="space-y-2">
                                  <li>
                                    • Number of Nodes: homeNodeCount: Integer ≥
                                    1
                                  </li>
                                  <li>
                                    • Cost per Node (USD): custom_cost_per_node:
                                    Float ≥ 0
                                  </li>
                                  <li>
                                    • Cores per Node: custom_core_per_node
                                    Integer ≥ 1
                                  </li>
                                </ul>
                              </ConfigItem>

                              <ConfigItem title="Memory Options">
                                <div className="grid grid-cols-2 gap-2">
                                  ramPerNode: 4, 8, 16, 32, 64, 96, 128, 192,
                                  256, 512, 1024, 2048
                                </div>
                              </ConfigItem>

                              <ConfigItem title="Storage">
                                <p>
                                  Storage per Node: storagePerNode: Integer ≥ 1
                                  GB
                                </p>
                              </ConfigItem>
                            </ServerConfigSection>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Storage Nodes Section */}
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-slate-900 dark:text-white">
                          Storage Nodes
                        </h4>
                        <button
                          className="text-blue-600 dark:text-blue-400 hover:underline text-sm focus:outline-none"
                          onClick={toggleStorageDetails}
                        >
                          {showStorageDetails ? "Hide Details" : "Show Details"}
                        </button>
                      </div>

                      {showStorageDetails ? (
                        <div className="space-y-6">
                          {/* Your existing details content */}
                          {/* Guided Mode for Storage */}
                          <ServerConfigSection title="Guided Mode Configuration mode:'guided'">
                            <ConfigItem title="Type of Storage">
                              <OptionsList
                                options={[
                                  "type: 'nvme' SSD NVMe",
                                  "type: 'sata' SSD SATA",
                                  "type: 'hdd' High Performance HDD",
                                  "type: 'tape' Low Performance HDD",
                                ]}
                              />
                            </ConfigItem>

                            <ConfigItem title="Storage Amount (TB)">
                              <p>amount: Integer ≥ 1</p>
                            </ConfigItem>
                          </ServerConfigSection>

                          {/* Custom Mode for Storage */}
                          <ServerConfigSection title="Custom Mode Configuration mode:'custom'">
                            <ConfigItem title="Price per TB (USD)">
                              <p>price: Float ≥ 0</p>
                            </ConfigItem>

                            <ConfigItem title="Type of Storage">
                              <OptionsList
                                options={[
                                  "type: 'nvme' SSD NVMe",
                                  "type: 'sata' SSD SATA",
                                  "type: 'hdd' High Performance HDD",
                                  "type: 'tape' Low Performance HDD",
                                ]}
                              />
                            </ConfigItem>

                            <ConfigItem title="Storage Amount (TB)">
                              <p>amount: Integer ≥ 1</p>
                            </ConfigItem>
                          </ServerConfigSection>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Click to show details
                        </p>
                      )}
                    </div>

                    {/* Network Section */}
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Network
                      </h4>
                      <div className="space-y-4">
                        <ConfigItem title="Provider">
                          <OptionsList
                            options={[
                              "'infiniband' Nvidia Mellanox Infiniband",
                              "'slingshot' HPE Cray Slingshot",
                            ]}
                          />
                        </ConfigItem>

                        <ConfigItem title="Topology">
                          <OptionsList
                            options={[
                              "'leaf-spine' Leaf-Spine",
                              "'fat-tree' Fat-Tree",
                              "'dragonfly' Dragonfly",
                            ]}
                          />
                        </ConfigItem>

                        <ConfigItem title="Bandwidth (GbE)">
                          • bandwidth: 50, 100, 200, 400
                        </ConfigItem>

                        <ConfigItem title="Tier Level">
                          • tier: 1, 2, 3, 4
                        </ConfigItem>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Power & Cooling Section */}
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Power & Cooling
                      </h4>
                      <div className="space-y-4">
                        <ConfigItem title="Desired Power Usage Effectiveness (PUE)">
                          <p>• pue: Float ≥ 1.0</p>
                        </ConfigItem>

                        <ConfigItem title="Cooling Method (cooling)">
                          <OptionsList
                            options={[
                              "'liquid' Liquid Cooling",
                              "'air' Air Cooling",
                            ]}
                          />
                        </ConfigItem>
                      </div>
                    </div>
                    {/* Software Section */}
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <h4 className="font-medium text-slate-900 dark:text-white mb-2">
                        Software
                      </h4>
                      <div className="space-y-4">
                        <ConfigItem title="Operating System (os)">
                          <OptionsList
                            options={[
                              "'suse' SUSE Linux Enterprise Server",
                              "'rh_vm' Red Hat for Virtual Datacenters",
                              "'rh_physical' Red Hat Enterprise Linux Server",
                              "'custom' Custom License",
                            ]}
                          />
                        </ConfigItem>

                        <ConfigItem title="Price Per Node (priceLicense)">
                          <p>
                            • Required only if <code>os</code> is{" "}
                            <code>'custom'</code>
                          </p>
                          <p>• priceLicense: Float ≥ 0</p>
                        </ConfigItem>
                      </div>
                    </div>
                  </div>

                  {/* Energy Cost Section */}
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-slate-900 dark:text-white mb-4">
                      Energy Cost
                    </h4>
                    <div className="space-y-4">
                      <ConfigItem title="Electricity Cost (eCost)">
                        <p>• eCost: Float ≥ 0 (in $/kWh)</p>
                        <p>• Default: 0.11</p>
                      </ConfigItem>
                      <ConfigItem title="Server Utilization Known? (choice)">
                        <OptionsList
                          options={[
                            "'yes' - Expected server utilization is known",
                            "'no' - Expected server utilization is unknown",
                          ]}
                        />
                      </ConfigItem>
                      <ConfigItem title="Expected Server Utilization (usage)">
                        <p>
                          • usage: Integer between 0 and 100 (in percentage)
                        </p>
                        <p>
                          • Required if <code>choice</code> is{" "}
                          <code>'yes'</code>
                        </p>
                      </ConfigItem>
                    </div>
                  </div>

                  {/* Labor Section */}
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-slate-900 dark:text-white">
                        Labor
                      </h4>
                      <button
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm focus:outline-none"
                        onClick={toggleLaborDetails}
                      >
                        {showLaborDetails ? "Hide Details" : "Show Details"}
                      </button>
                    </div>
                    {showLaborDetails && (
                      <div className="space-y-4">
                        <ConfigItem title="Estimation Mode (mode)">
                          <OptionsList
                            options={[
                              "'guided' - System estimates employees and cost based on system size",
                              "'custom' - User provides specific roles and number of employees",
                            ]}
                          />
                        </ConfigItem>

                        {/* For 'custom' mode */}
                        <ConfigItem title="Custom Mode Configuration">
                          <p>
                            When <code>mode</code> is <code>'custom'</code>,
                            provide a list of workers with their roles and
                            counts:
                          </p>
                          <CodeBlock
                            code={{
                              workers: [
                                {
                                  role: "SYSTEMS_ADMINISTRATORS",
                                  count: 6,
                                },
                                {
                                  role: "NETWORK_ENGINEER",
                                  count: 4,
                                },
                                ` // ... more workers `,
                              ],
                            }}
                          />

                          <p>
                            The <code>role</code> must be one of the predefined
                            roles.
                          </p>
                        </ConfigItem>

                        <ConfigItem title="Available Roles">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(SALARIES).map(
                              ([category, roles], idx) => (
                                <div key={idx}>
                                  <h5 className="font-semibold mt-2">
                                    {category}
                                  </h5>
                                  <ul className="ml-4 space-y-1">
                                    {Object.keys(roles).map((role, index) => (
                                      <li
                                        key={index}
                                        className="text-slate-600 dark:text-slate-300"
                                      >
                                        • {role}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )
                            )}
                          </div>
                        </ConfigItem>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* JSON Preview - Same as before */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>JSON Preview</CardTitle>
                  <button
                    className="bg-white text-gray-800 px-4 py-2 rounded-md shadow-md hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={toggleMenu}
                  >
                    {showSchema ? "View Example" : "View Schema"}
                  </button>
                </div>
              </CardHeader>
              <CardContent>
                <JsonExample />
                <div className="mt-4">
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    The JSON must follow the naming convention and schema
                    provided otherwise it will not work.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips - Same as before */}
            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="mr-2">📝</span>
                      Validate your JSON before uploading
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">⚡</span>
                      Make sure the name are strictly the one explained in the
                      top section
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🔍</span>
                      Double-check your numeric values
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">🚀</span>
                      For a quick test copy and try the example
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Footer - Same as before */}
        <footer className="mt-12 text-center text-sm text-slate-600 dark:text-slate-300">
          <p>
            Need help? Contact me at{" "}
            <a
              href="mailto:mbonaf3@uic.edu"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              mbonaf3@uic.edu
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default infoUpload;
