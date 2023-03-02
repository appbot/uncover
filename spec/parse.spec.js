const parse = require("../lib/parse");

describe("parse", () => {
  set(
    "input",
    `TN:
     SF:file.js
     FN:1,method
     FNF:1
     FNH:1
     FNDA:4,method
     DA:1,1
     DA:4,3
     DA:5,3
     DA:6,3
     DA:7,3
     LF:5
     LH:5
     BRDA:4,1,0,3
     BRDA:5,1,1,0
     BRF:2
     BRH:1
     end_of_record`
      .split("\n")
      .map(l => l.trim())
  );

  subject(() => parse(input));

  it("parses correctly", () =>
    expect(subject).to.deep.eql({
      file: "file.js",
      lines: [, 1, , , 3, 3, 3, 3],
      functions: { names: ["method"], lines: [1], hits: [4] },
      branches: [{ lines: [4, 5], hits: [3, 0] }],
    }));

  context("when a function execution is missing", () => {
    set(
      "input",
      `TN:
       SF:file.js
       FN:1,method
       FN:4,method2
       FNF:1
       FNH:1
       FNDA:4,method2
       DA:1,1
       DA:4,3
       LF:5
       LH:5
       BRF:0
       BRH:0
       end_of_record`
        .split("\n")
        .map(l => l.trim())
    );

    it("keeps the method associations correct", () =>
      expect(subject.functions).to.deep.eq({
        names: ["method", "method2"],
        lines: [1, 4],
        hits: [0, 4],
      }));
  });
});
