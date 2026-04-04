import { useReducer } from "react";
import { calculatorButtons } from "./calculatorButtons";
import {
  getCalculatorClearLabel,
  isOperatorActive,
  type CalculatorOperator,
  initialCalculatorState,
  reduceCalculatorState,
} from "./calculatorState";
import "./calculator.css";

export function CalculatorApp() {
  const [state, dispatch] = useReducer(
    reduceCalculatorState,
    initialCalculatorState,
  );

  return (
    <section className="calculator-app">
      <div className="calculator-app__display">{state.display}</div>
      <div className="calculator-app__keypad">
        {calculatorButtons.flatMap((row, rowIndex) =>
          row.map((button) => (
            <button
              className={[
                "calculator-app__key",
                `calculator-app__key--${button.variant}`,
                button.wide ? "calculator-app__key--wide" : "",
                button.variant === "operator" &&
                button.action.kind === "operator" &&
                isOperatorActive(
                  state,
                  button.action.value as CalculatorOperator,
                )
                  ? "calculator-app__key--operator-active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              key={`${rowIndex}-${button.id}`}
              onClick={() => {
                dispatch(button.action);
              }}
              type="button"
            >
              {button.id === "clear"
                ? getCalculatorClearLabel(state)
                : button.label}
            </button>
          )),
        )}
      </div>
    </section>
  );
}
