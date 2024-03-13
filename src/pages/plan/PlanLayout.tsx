import Container from "react-bootstrap/Container";
import { RulesContainer } from "./rules/RulesContainer";
import { TransactionsContainer } from "./transactions/TransactionsContainer";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { DayByDayContainer } from "./daybyday/DayByDayContainer";
import { ParametersContainer } from "./parameters/ParametersContainer";

import { IFlags } from "../../services/FlagService";
import { IParameters } from "../../services/ParameterService";
import { IApiRule, RulesService } from "../../services/RulesService";
import { IApiDayByDay } from "../../services/DayByDayService";
import { IApiTransaction } from "../../services/TransactionsService";
import { Reconciler } from "./parameters/Reconciler";
import { Summary } from "./Summary";
import { IParametersActions, IRuleActions } from "./PlanProvider";

import "./Plan.css";
import { TransactionActions } from "./ComputationsContainer";
import Button from "react-bootstrap/esm/Button";
import { createDefaultRules } from "../../components/createDefaultRules";

interface PlanLayoutProps {
  rules: IApiRule[];
  ruleActions: IRuleActions;

  parameters: IParameters;
  parametersActions: IParametersActions;

  flags: IFlags;

  transactions: IApiTransaction[];
  transactionActions: TransactionActions;

  daybydays: IApiDayByDay;
}
export const PlanLayout = ({
  rules,
  ruleActions,

  parameters,
  parametersActions,

  flags,

  transactions,
  transactionActions,

  daybydays,
}: PlanLayoutProps) => {
  const hasRules = !!rules.length;
  return (
    <div className="plancontainer" style={{ height: "90vh" }}>
      <Row>
        <Col lg={3}>
          <Summary daybyday={daybydays} parameters={parameters} />
          <Reconciler
            parameters={parameters}
            transactions={transactions}
            setParameters={parametersActions.setParameters}
            transactionActions={transactionActions}
          />
          <ParametersContainer
            parameters={parameters}
            setParameters={parametersActions.setParameters}
          />
          <RulesContainer
            rules={rules}
            ruleActions={ruleActions}
            flags={flags}
            parameters={parameters}
          />
        </Col>
        <Col lg={9}>
          {hasRules ? (
            <>
              <DayByDayContainer
                flags={flags}
                daybydays={daybydays}
                parameters={parameters}
                height="45vh"
              />
              <TransactionsContainer
                transactions={transactions}
                transactionActions={transactionActions}
              />
            </>
          ) : (
            <Container className="justify-content-middle text-center mt-5 mb-5">
              <h3>
                Welcome! Start by adding your expected income and expenses.
              </h3>
              <Button
                variant="outline-primary"
                onClick={() => {
                  const newRules = createDefaultRules();
                  RulesService.batchCreateRules(newRules);
                  // TODO
                  alert("TODO: need to cause rules to refresh");
                }}
              >
                Quickstart: add default income/expenses
              </Button>
            </Container>
          )}
        </Col>
      </Row>
    </div>
  );
};
