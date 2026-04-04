export type CalculatorOperator = "+" | "−" | "×" | "÷";

export type CalculatorAction =
  | { kind: "digit"; value: string }
  | { kind: "decimal" }
  | { kind: "operator"; value: CalculatorOperator }
  | { kind: "equals" }
  | { kind: "clear" }
  | { kind: "toggle-sign" }
  | { kind: "percent" };

export type CalculatorState = {
  display: string;
  storedValue: number | null;
  pendingOperator: CalculatorOperator | null;
  isFreshEntry: boolean;
  shouldShowAllClear: boolean;
};

export const initialCalculatorState: CalculatorState = {
  display: "0",
  storedValue: null,
  pendingOperator: null,
  isFreshEntry: true,
  shouldShowAllClear: true,
};

function isDisplayError(state: CalculatorState): boolean {
  return state.display === "Error";
}

function parseDisplayValue(display: string): number {
  const value = Number(display);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return value;
}

function formatDisplayValue(value: number): string {
  if (Object.is(value, -0)) {
    return "0";
  }

  const text = value.toString();

  if (text.includes("e")) {
    return value.toPrecision(10).replace(/\.?0+$/, "");
  }

  if (text.includes(".")) {
    return text.replace(/\.?0+$/, "");
  }

  return text;
}

function applyPendingOperator(
  operator: CalculatorOperator,
  left: number,
  right: number,
): number | "Error" {
  switch (operator) {
    case "+":
      return left + right;
    case "−":
      return left - right;
    case "×":
      return left * right;
    case "÷":
      return right === 0 ? "Error" : left / right;
  }
}

function writeDigit(
  state: CalculatorState,
  digit: string,
): CalculatorState {
  if (isDisplayError(state)) {
    return {
      ...initialCalculatorState,
      display: digit,
      isFreshEntry: false,
      shouldShowAllClear: false,
    };
  }

  if (state.isFreshEntry) {
    return {
      ...state,
      display: digit,
      isFreshEntry: false,
      shouldShowAllClear: false,
    };
  }

  if (state.display === "0") {
    return {
      ...state,
      display: digit,
      shouldShowAllClear: false,
    };
  }

  return {
    ...state,
    display: `${state.display}${digit}`,
    shouldShowAllClear: false,
  };
}

function writeDecimal(state: CalculatorState): CalculatorState {
  if (isDisplayError(state)) {
    return {
      ...initialCalculatorState,
      display: "0.",
      isFreshEntry: false,
      shouldShowAllClear: false,
    };
  }

  if (state.isFreshEntry) {
    return {
      ...state,
      display: "0.",
      isFreshEntry: false,
      shouldShowAllClear: false,
    };
  }

  if (state.display.includes(".")) {
    return state;
  }

  return {
    ...state,
    display: `${state.display}.`,
    shouldShowAllClear: false,
  };
}

function applyOperator(
  state: CalculatorState,
  operator: CalculatorOperator,
): CalculatorState {
  if (isDisplayError(state)) {
    return initialCalculatorState;
  }

  const currentValue = parseDisplayValue(state.display);

  if (state.storedValue === null || state.isFreshEntry) {
    return {
      ...state,
      storedValue: state.storedValue ?? currentValue,
      pendingOperator: operator,
      isFreshEntry: true,
    };
  }

  if (state.pendingOperator === null) {
    return {
      ...state,
      storedValue: currentValue,
      pendingOperator: operator,
      isFreshEntry: true,
    };
  }

  const nextValue = applyPendingOperator(
    state.pendingOperator,
    state.storedValue,
    currentValue,
  );

  if (nextValue === "Error") {
    return {
      ...initialCalculatorState,
      display: "Error",
      shouldShowAllClear: true,
    };
  }

  return {
    ...state,
    display: formatDisplayValue(nextValue),
    storedValue: nextValue,
    pendingOperator: operator,
    isFreshEntry: true,
  };
}

function applyEquals(state: CalculatorState): CalculatorState {
  if (isDisplayError(state)) {
    return initialCalculatorState;
  }

  if (state.pendingOperator === null || state.storedValue === null) {
    return state;
  }

  const currentValue = parseDisplayValue(state.display);
  const nextValue = applyPendingOperator(
    state.pendingOperator,
    state.storedValue,
    currentValue,
  );

  if (nextValue === "Error") {
    return {
      ...initialCalculatorState,
      display: "Error",
      shouldShowAllClear: true,
    };
  }

  return {
    ...state,
    display: formatDisplayValue(nextValue),
    storedValue: null,
    pendingOperator: null,
    isFreshEntry: true,
  };
}

function applyClear(state: CalculatorState): CalculatorState {
  if (state.shouldShowAllClear) {
    return initialCalculatorState;
  }

  return {
    ...state,
    display: "0",
    isFreshEntry: true,
    shouldShowAllClear: true,
  };
}

function applyToggleSign(state: CalculatorState): CalculatorState {
  if (isDisplayError(state)) {
    return state;
  }

  const currentValue = parseDisplayValue(state.display);

  return {
    ...state,
    display: formatDisplayValue(currentValue * -1),
  };
}

function applyPercent(state: CalculatorState): CalculatorState {
  if (isDisplayError(state)) {
    return state;
  }

  const currentValue = parseDisplayValue(state.display);

  return {
    ...state,
    display: formatDisplayValue(currentValue / 100),
    shouldShowAllClear: false,
  };
}

export function getCalculatorClearLabel(
  state: CalculatorState,
): "AC" | "C" {
  return state.shouldShowAllClear ? "AC" : "C";
}

export function isOperatorActive(
  state: CalculatorState,
  operator: CalculatorOperator,
): boolean {
  return (
    state.pendingOperator === operator &&
    state.isFreshEntry &&
    state.storedValue !== null &&
    !isDisplayError(state)
  );
}

export function reduceCalculatorState(
  state: CalculatorState,
  action: CalculatorAction,
): CalculatorState {
  switch (action.kind) {
    case "digit":
      return writeDigit(state, action.value);
    case "decimal":
      return writeDecimal(state);
    case "operator":
      return applyOperator(state, action.value);
    case "equals":
      return applyEquals(state);
    case "clear":
      return applyClear(state);
    case "toggle-sign":
      return applyToggleSign(state);
    case "percent":
      return applyPercent(state);
  }
}
