import { faCircleQuestion } from "@fortawesome/free-regular-svg-icons/faCircleQuestion";
import { Info } from "../../../components/Info";
import {
  Currency,
  CurrencyColorless,
} from "../../../components/currency/Currency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  balanceWillZeroState,
  freeToSpendState,
  startDateState,
} from "../../../store/parameters";
import { useSignalValue } from "../../../store/useSignalValue";
import { computedDayByDays, daybydaysState } from "../../../store/daybydays";
import { computed } from "@preact/signals-core";
import { formatDistance } from "date-fns/formatDistance";
import { fromStringToDate } from "../../../services/engine/rrule";
import { DateDisplay } from "../../../components/date/DateDisplay";
import { durationDaysDisplayState } from "../../../store/displayDateRange";

const FreeToSpend = () => {
  const freeToSpend = useSignalValue(freeToSpendState);
  const balanceWillZero = useSignalValue(balanceWillZeroState);

  return (
    <div className="text-center" id="free-to-spend-today">
      Today: <Currency value={freeToSpend} />{" "}
      <Info
        infobody={
          <>
            Based on your expected income and expenses, your{" "}
            <strong>free to spend</strong> (lowest future balance) is{" "}
            {freeToSpend > 0 ? "above" : "below"} your safety net by{" "}
            <strong>
              <CurrencyColorless value={freeToSpend} />
            </strong>
            .
            {freeToSpend < 0 ? (
              <>
                <br />
                <br />
                Consider transferring money from savings accounts, cutting
                costs, or delaying expenses to avoid{" "}
                {balanceWillZero ? (
                  <>running out of money.</>
                ) : (
                  <>dipping into your safety net.</>
                )}
              </>
            ) : null}
          </>
        }
      >
        <FontAwesomeIcon icon={faCircleQuestion} />
      </Info>
    </div>
  );
};

const dateSetAsideMetState = computed(() => {
  const dbdAbove = computedDayByDays.value.find(
    (d) => d.working_capital.open > 0,
  );
  if (!dbdAbove) return;
  return dbdAbove.date;
});
const distanceToSetAsideState = computed(() => {
  if (!dateSetAsideMetState.value) return;
  if (startDateState.value === dateSetAsideMetState.value) return;
  return formatDistance(
    fromStringToDate(startDateState.value),
    fromStringToDate(dateSetAsideMetState.value),
  );
});

const SafetyNetStatus = () => {
  const dateSetAsideMet = useSignalValue(dateSetAsideMetState);
  const distanceToSetAside = useSignalValue(distanceToSetAsideState);

  return (
    <div className="text-center">
      Safety net:{" "}
      {distanceToSetAside ? (
        <span>funded in {distanceToSetAside}</span>
      ) : (
        <span style={{ color: "var(--green)" }}>funded</span>
      )}{" "}
      {distanceToSetAside ? (
        <Info
          infobody={
            <>
              Based on your expected income and expenses, you will have fully
              funded your safety net on{" "}
              <DateDisplay date={dateSetAsideMet as string} simple />.
            </>
          }
        >
          <FontAwesomeIcon icon={faCircleQuestion} />
        </Info>
      ) : null}
    </div>
  );
};

const finalVisibleDayByDayState = computed(() => daybydaysState.value.at(-1));
const FreeToSpendInAYear = () => {
  const finalVisibleDayByDay = useSignalValue(finalVisibleDayByDayState);
  const durationDaysDisplay = useSignalValue(durationDaysDisplayState);

  if (!finalVisibleDayByDay) return null; // shouldn't be showing

  const freeToSpendAtEndOfDuration = finalVisibleDayByDay.working_capital.close;
  const durationEndDate = finalVisibleDayByDay.date;

  return (
    <div className="text-center">
      {durationDaysDisplay} forecast:{" "}
      <Currency value={freeToSpendAtEndOfDuration} />{" "}
      <Info
        infobody={
          <>
            Based on your expected income and expenses, will have{" "}
            <strong>
              <CurrencyColorless value={freeToSpendAtEndOfDuration} />
            </strong>{" "}
            free to spend on{" "}
            <strong>
              <DateDisplay date={durationEndDate} simple />
            </strong>
            .
          </>
        }
      >
        <FontAwesomeIcon icon={faCircleQuestion} />
      </Info>
    </div>
  );
};

export const UpwardSummary = () => {
  return (
    <>
      <FreeToSpend />
      <SafetyNetStatus />
      <FreeToSpendInAYear />
    </>
  );
};
