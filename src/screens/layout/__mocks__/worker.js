import { pack } from "../worker";
import { testState } from "../../../utils/test-utils";
const responses = [
  [
    [
      {
        item: {
          name: "Door",
          id: 1,
          dimensions: { width: "2'", height: "2'" },
          instanceNumber: 1
        },
        width: 24000,
        height: 24000,
        x: 0,
        y: 0,
        bin: 1
      },
      {
        item: {
          name: "Door",
          id: 1,
          dimensions: { width: "2'", height: "2'" },
          instanceNumber: 2
        },
        width: 24000,
        height: 24000,
        x: 24125,
        y: 0,
        bin: 1
      },
      {
        item: {
          name: "Shelf",
          id: 2,
          dimensions: { width: "3'", height: "3'" },
          instanceNumber: 1
        },
        width: 36000,
        height: 36000,
        x: 48250,
        y: 0,
        bin: 1
      }
    ],
    [
      {
        item: {
          name: "Shelf",
          id: 2,
          dimensions: { width: "3'", height: "3'" },
          instanceNumber: 2
        },
        width: 36000,
        height: 36000,
        x: 0,
        y: 0,
        bin: 2
      }
    ]
  ],
  [
    [
      {
        item: {
          name: "Back Panel",
          id: 1,
          dimensions: { width: "2'", height: "2'" },
          instanceNumber: 1
        },
        width: 24000,
        height: 24000,
        x: 0,
        y: 0,
        bin: 1
      },
      {
        item: {
          name: "Drawer bottom",
          id: 2,
          dimensions: { width: "17", height: "24" },
          instanceNumber: 1
        },
        width: 17000,
        height: 24000,
        x: 24125,
        y: 0,
        bin: 1
      },
      {
        item: {
          name: "Drawer bottom",
          id: 2,
          dimensions: { width: "17", height: "24" },
          instanceNumber: 2
        },
        width: 17000,
        height: 24000,
        x: 41250,
        y: 0,
        bin: 1
      },
      {
        item: {
          name: "Drawer bottom",
          id: 2,
          dimensions: { width: "17", height: "24" },
          instanceNumber: 3
        },
        width: 17000,
        height: 24000,
        x: 58375,
        y: 0,
        bin: 1
      },
      {
        item: {
          name: "Drawer bottom",
          id: 2,
          dimensions: { width: "17", height: "24" },
          instanceNumber: 4
        },
        width: 17000,
        height: 24000,
        x: 75500,
        y: 0,
        bin: 1
      }
    ]
  ]
];

export default function mockWorker() {
  return {
    pack: ({ items }) => {
      if (testState.materials[0].parts.length === items.length) {
        return Promise.resolve(responses[0]);
      } else {
        return Promise.resolve(responses[1]);
      }
    }
  };
}
