import binPacker from "..";

test("pack a single", () => {
  const result = binPacker({
    binHeight: 30,
    binWidth: 30,
    items: [
      {
        name: "test",
        width: 20,
        height: 20
      },
      {
        name: "test2",
        width: 15,
        height: 5
      }
    ]
  });
  expect(result).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "bin": 1,
          "height": 15,
          "item": Object {
            "name": "test2",
          },
          "width": 5,
          "x": 0,
          "y": 0,
        },
        Object {
          "bin": 1,
          "height": 20,
          "item": Object {
            "name": "test",
          },
          "width": 20,
          "x": 5,
          "y": 0,
        },
      ],
    ]
  `);
});

test("should rotate items if it results in more efficent packing", () => {
  const result = binPacker(
    {
      binHeight: 40,
      binWidth: 80,
      items: [
        {
          name: "40x20",
          width: 40,
          height: 20
        },
        {
          name: "40x20",
          width: 40,
          height: 20
        }
      ]
    },
    {
      kerfSize: 2,
      sortStrategy: "Area",
      splitStrategy: "SAS",
      selectionStrategy: "BEST_AREA_FIT"
    }
  );
  expect(result).toHaveLength(1);
});

test("pack two", () => {
  const result = binPacker({
    binHeight: 30,
    binWidth: 30,
    items: [
      {
        name: "test",
        width: 20,
        height: 20
      },
      {
        name: "test2",
        width: 20,
        height: 20
      }
    ]
  });
  expect(result).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "bin": 1,
          "height": 20,
          "item": Object {
            "name": "test",
          },
          "width": 20,
          "x": 0,
          "y": 0,
        },
      ],
      Array [
        Object {
          "bin": 2,
          "height": 20,
          "item": Object {
            "name": "test2",
          },
          "width": 20,
          "x": 0,
          "y": 0,
        },
      ],
    ]
  `);
});

test("create kerfs if provided", () => {
  const result = binPacker(
    {
      binHeight: 30,
      binWidth: 30,
      items: [
        {
          name: "test",
          width: 20,
          height: 20
        },
        {
          name: "kerfed offcut",
          width: 5,
          height: 5
        }
      ]
    },
    { kerfSize: 2 }
  );
  expect(result).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "bin": 1,
          "height": 5,
          "item": Object {
            "name": "kerfed offcut",
          },
          "width": 5,
          "x": 0,
          "y": 0,
        },
        Object {
          "bin": 1,
          "height": 20,
          "item": Object {
            "name": "test",
          },
          "width": 20,
          "x": 7,
          "y": 0,
        },
      ],
    ]
  `);
});

test("throw error if item too large for bin", () => {
  const invalidItem = () =>
    binPacker({
      binHeight: 30,
      binWidth: 30,
      items: [
        {
          width: 40,
          height: 40
        }
      ]
    });
  expect(invalidItem).toThrowError("exceeds bin dimensions");
});
