const uncheck = require("../lib/uncheck");

describe("uncheck", () => {
  set("lines", [null, 1, 3, 4, 0, null, 3]);

  describe("branch unchecker", () => {
    subject(() => uncheck({ lines, branches }));

    context("with an uncovered branch", () => {
      context("when else branch is provided", () => {
        set("branches", [{ lines: [2, 2, 2], hits: [3, 0, 0] }]);

        it("uncovers the line with no branch coverage", () =>
          expect(subject).to.have.ordered.members([null, 1, 0, 4, 0, null, 3]));
      });

      context("when else branch is not provided (c8)", () => {
        set("branches", [{ lines: [2], hits: [3] }]);

        it("does not change the coverage", () =>
          expect(subject).to.have.ordered.members([null, 1, 3, 4, 0, null, 3]));
      });
    });

    context("with full covered branches", () => {
      set("branches", [{ lines: [2, 2, 2], hits: [1, 1, 1] }]);

      it("leaves the lines unchanged", () =>
        expect(subject).to.have.ordered.members(lines));
    });

    context("with no branches", () => {
      set("branches", null);

      it("leaves the lines unchanged", () =>
        expect(subject).to.have.ordered.members(lines));
    });
  });

  describe("function unchecker", () => {
    subject(() => uncheck({ lines, functions }));

    context("with an uncovered function", () => {
      set("functions", { lines: [1, 2, 3], hits: [3, 0, 0] });

      it("uncovers the line with no branch coverage", () =>
        expect(subject).to.have.ordered.members([null, 1, 0, 0, 0, null, 3]));
    });

    context("with full covered functions", () => {
      set("functions", { lines: [1, 2, 3], hits: [3, 1, 5] });

      it("leaves the lines unchanged", () =>
        expect(subject).to.have.ordered.members(lines));
    });

    context("with no functions", () => {
      set("functions", null);

      it("leaves the lines unchanged", () =>
        expect(subject).to.have.ordered.members(lines));
    });
  });
});
