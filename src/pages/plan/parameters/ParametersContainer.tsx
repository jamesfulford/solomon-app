import { useCallback, useEffect, useState } from "react";
import {
  currentBalanceState,
  setAsideState,
  setParameters,
} from "../../../store/parameters";

import "./Parameters.css";

import InputGroup from "react-bootstrap/esm/InputGroup";
import { HelpInputGroup } from "../../../components/HelpInputGroup";
import { CurrencyInputSubGroup } from "../../../components/CurrencyInput";

export const ParametersContainer = () => {
  const [currentBalance, setCurrentBalance] = useState(
    currentBalanceState.peek(),
  );
  useEffect(
    () =>
      currentBalanceState.subscribe((newBalance) =>
        setCurrentBalance(newBalance),
      ),
    [],
  );

  const [setAside, setSetAside] = useState(setAsideState.peek());
  useEffect(
    () => setAsideState.subscribe((newSetAside) => setSetAside(newSetAside)),
    [],
  );

  const submit = useCallback(() => {
    if (
      setAside === setAsideState.peek() &&
      currentBalance === currentBalanceState.peek()
    ) {
      // if no change, do nothing
      return;
    }

    setParameters({
      setAside,
      currentBalance,
    });
  }, [currentBalance, setAside]);

  return (
    <div>
      <div className="form-inline">
        <InputGroup size="sm">
          <CurrencyInputSubGroup
            value={currentBalance}
            controlId="currentBalance"
            label={"Balance today"}
            onValueChange={setCurrentBalance}
            onBlur={submit}
            style={{ color: undefined }}
          />
          <HelpInputGroup helptext="Put your main account balance in here (usually checking). We will start with that balance when predicting your future balances. If you have multiple checking accounts, consider creating another profile for each one." />
        </InputGroup>

        <InputGroup size="sm">
          <CurrencyInputSubGroup
            value={setAside}
            controlId="setAside"
            label={"Safety net"}
            onValueChange={setSetAside}
            onBlur={submit}
            style={{ color: undefined }}
          />
          <HelpInputGroup
            helptext={
              <>
                AKA "emergency fund." Input here how much you would like to set
                aside for emergencies.{" "}
                <a
                  href="https://www.ramseysolutions.com/dave-ramsey-7-baby-steps#baby-step-1"
                  target="_blank"
                  style={{ color: "inherit" }}
                >
                  Dave Ramsey's Baby Step #1 to getting out of debt
                </a>{" "}
                advises setting aside $1,000.
              </>
            }
          />
        </InputGroup>
      </div>
    </div>
  );
};
