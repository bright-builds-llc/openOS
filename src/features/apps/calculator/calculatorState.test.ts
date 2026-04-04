import { describe, expect, it } from "vitest";
import {
  initialCalculatorState,
  reduceCalculatorState,
} from "./calculatorState";

describe("calculatorState", () => {
  it("builds multi-digit numbers from digit input", () => {
    // Arrange
    const firstDigit = reduceCalculatorState(initialCalculatorState, {
      kind: "digit",
      value: "7",
    });

    // Act
    const result = reduceCalculatorState(firstDigit, {
      kind: "digit",
      value: "5",
    });

    // Assert
    expect(result.display).toBe("75");
  });

  it("supports decimal entry without duplicating the decimal point", () => {
    // Arrange
    const withDigit = reduceCalculatorState(initialCalculatorState, {
      kind: "digit",
      value: "3",
    });
    const withDecimal = reduceCalculatorState(withDigit, {
      kind: "decimal",
    });

    // Act
    const result = reduceCalculatorState(withDecimal, {
      kind: "decimal",
    });

    // Assert
    expect(result.display).toBe("3.");
  });

  it("evaluates chained operator input", () => {
    // Arrange
    let state = initialCalculatorState;
    state = reduceCalculatorState(state, { kind: "digit", value: "7" });
    state = reduceCalculatorState(state, { kind: "operator", value: "+" });
    state = reduceCalculatorState(state, { kind: "digit", value: "5" });
    state = reduceCalculatorState(state, { kind: "equals" });

    // Act
    const result = state.display;

    // Assert
    expect(result).toBe("12");
  });

  it("treats clear as all-clear first and entry clear after input", () => {
    // Arrange
    const withDigit = reduceCalculatorState(initialCalculatorState, {
      kind: "digit",
      value: "8",
    });

    // Act
    const result = reduceCalculatorState(withDigit, {
      kind: "clear",
    });

    // Assert
    expect(result.display).toBe("0");
    expect(result.shouldShowAllClear).toBe(true);
  });

  it("toggles sign on the current display value", () => {
    // Arrange
    const withDigit = reduceCalculatorState(initialCalculatorState, {
      kind: "digit",
      value: "9",
    });

    // Act
    const result = reduceCalculatorState(withDigit, {
      kind: "toggle-sign",
    });

    // Assert
    expect(result.display).toBe("-9");
  });

  it("applies percent to the current display value", () => {
    // Arrange
    const withDigits = reduceCalculatorState(
      reduceCalculatorState(initialCalculatorState, {
        kind: "digit",
        value: "5",
      }),
      {
        kind: "digit",
        value: "0",
      },
    );

    // Act
    const result = reduceCalculatorState(withDigits, {
      kind: "percent",
    });

    // Assert
    expect(result.display).toBe("0.5");
  });

  it("keeps pending state when clear resets only the current entry", () => {
    // Arrange
    let state = initialCalculatorState;
    state = reduceCalculatorState(state, { kind: "digit", value: "8" });
    state = reduceCalculatorState(state, { kind: "operator", value: "+" });
    state = reduceCalculatorState(state, { kind: "digit", value: "4" });

    // Act
    state = reduceCalculatorState(state, { kind: "clear" });
    state = reduceCalculatorState(state, { kind: "digit", value: "2" });
    state = reduceCalculatorState(state, { kind: "equals" });

    // Assert
    expect(state.display).toBe("10");
  });

  it("returns an error display when dividing by zero", () => {
    // Arrange
    let state = initialCalculatorState;
    state = reduceCalculatorState(state, { kind: "digit", value: "9" });
    state = reduceCalculatorState(state, { kind: "operator", value: "÷" });
    state = reduceCalculatorState(state, { kind: "digit", value: "0" });

    // Act
    state = reduceCalculatorState(state, { kind: "equals" });

    // Assert
    expect(state.display).toBe("Error");
  });
});
