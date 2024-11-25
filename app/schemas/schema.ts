export const tcoSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  properties: {
    datacenter: {
      type: "object",
      properties: {
        land: {
          type: "object",
          properties: {
            ft: {
              type: "number",
              minimum: 0,
              default: 10,
            },
            occupancy: {
              type: "number",
              minimum: 0,
              default: 60,
            },
            powerRating: {
              type: "number",
              minimum: 0,
              default: 2,
            },
            rentalRate: {
              type: "number",
              minimum: 0,
              default: 150,
            },
            cap: {
              type: "number",
              minimum: 0,
              default: 8,
            },
          },
        },

        serverClusters: {
          type: "array",
          items: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["custom", "guided"],
                default: "guided",
              },
              cpu: {
                type: "string",
                default: "intel_gold",
              },
              homeNodeCount: {
                type: "number",
                minimum: 0,
                default: 1,
              },
              processorsPerNode: {
                type: "integer",
                enum: [1, 2],
                default: 1,
              },
              coresPerProcessor: {
                type: "integer",
                minimum: 0,
                default: 8,
              },
              ramPerNode: {
                type: "integer",
                minimum: 0,
                default: 16,
              },
              storagePerNode: {
                type: "number",
                minimum: 0,
                default: 256,
              },
              typeOfSSD: {
                type: "string",
                enum: ["high", "low", "mid"],
                default: "high",
              },
              gpu: {
                type: "string",
                default: "a100-40",
              },
              gpu_perNode: {
                type: "number",
                minimum: 0,
                default: 1,
              },
              gpu_model: {
                type: "string",
                default: "nvidia",
              },
              custom_cost_per_node: {
                type: "number",
                minimum: 0,
                default: 0,
              },
              custom_core_per_node: {
                type: "number",
                minimum: 0,
                default: 8,
              },
            },
          },
        },

        storageNodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              mode: {
                type: "string",
                enum: ["custom", "guided"],
                default: "guided",
              },
              type: {
                type: "string",
                enum: ["sata", "nvme", "hdd", "tape"],
                default: "hdd",
              },
              amount: { type: "integer", minimum: 0, default: 10 },
              price: { type: "number", minimum: 0, default: 1 },
            },
          },
        },

        network: {
          type: "object",
          properties: {
            provider: {
              type: "string",
              enum: ["infiniband", "slingshot"],
              default: "infiniband",
            },
            tier: { type: "integer", enum: [1, 2, 3, 4], default: 2 },
            bandwidth: {
              type: "integer",
              enum: [50, 100, 200, 400],
              default: 100,
            },
            topology: {
              type: "string",
              enum: ["dragonfly", "fat-tree", "leaf-spine"],
              default: "spine",
            },
          },
        },

        powerDistributionAndCooling: {
          type: "object",
          properties: {
            pue: { type: "number", minimum: 0, default: 1.35 },
            cooling: {
              type: "string",
              enum: ["liquid", "air"],
              default: "liquid",
            },
          },
        },

        energyCost: {
          type: "object",
          properties: {
            eCost: { type: "number", minimum: 0, default: 0.11 },
            choice: { type: "string", enum: ["yes", "no"], default: "no" },
            usage: { type: "number", minimum: 0, default: 70 },
          },
        },

        software: {
          type: "object",
          properties: {
            os: {
              type: "string",
              enum: ["suse", "rh_vm", "rh_physical", "custom"],
              default: "suse",
            },
            priceLicense: {
              type: "number",
              minimum: 0,
              default: 0,
            },
          },
        },

        labor: {
          type: "object",
          properties: {
            mode: {
              type: "string",
              enum: ["guided", "custom"],
              default: "guided",
            },
            workers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  role: { type: "string" },
                  count: { type: "number", minimum: 0 },
                },
              },
            },
          },
        },
      },
    },
  },
  required: ["datacenter"],
};
