import { IApiTransaction } from "../../../services/TransactionsService";

import { AgGridReact, AgGridReactProps } from "ag-grid-react"; // React Grid Logic
import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css"; // Theme
import { useCallback, useEffect, useMemo, useRef } from "react";
import Button from "react-bootstrap/Button";
import {
  Currency,
  CurrencyColorless,
} from "../../../components/currency/Currency";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarDays,
  faFileCsv,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import { TransactionActions } from "../ComputationsContainer";
import Tippy, { useSingleton } from "@tippyjs/react";
import { GridApi, IRowNode } from "ag-grid-community";
import { selectedDate } from "../../../store";

export const TransactionsContainer = ({
  transactions,
  transactionActions,
}: {
  transactions: IApiTransaction[];
  transactionActions: TransactionActions;
}) => {
  const [source, target] = useSingleton();
  const columns: AgGridReactProps["columnDefs"] = useMemo(
    (): AgGridReactProps["columnDefs"] => [
      {
        field: "day",
        headerName: "Transaction Date",
        sortable: false,
        filter: "agDateColumnFilter",
        filterParams: {
          minValidDate: transactions.at(0)?.day,
          maxValidDate: transactions.at(-1)?.day,
          buttons: ["clear"],
        },

        editable: true,
        cellEditor: "agDateStringCellEditor",
        cellEditorParams: {
          min: transactions.at(0)?.day,
        },
        onCellValueChanged: ({ oldValue, newValue, data: transaction }) => {
          const oldTransaction: IApiTransaction = {
            ...transaction,
            day: oldValue, // ag-grid mutates this value before calling
          };
          transactionActions.deferTransaction(oldTransaction, newValue);
        },

        suppressMovable: true,
        resizable: false,
        flex: 1,
      },
      {
        field: "name",
        headerName: "Name",
        filter: "agTextColumnFilter",
        sortable: false,
        suppressMovable: true,
        resizable: false,
        flex: 2,
      },
      {
        field: "value",
        headerName: "Amount",
        sortable: false,
        suppressMovable: true,
        cellRenderer: Currency,
        resizable: false,
        flex: 1,
      },
      {
        field: "calculations.balance",
        headerName: "Balance",
        sortable: false,
        suppressMovable: true,
        cellRenderer: CurrencyColorless,
        resizable: false,
        flex: 1,
      },
      {
        field: "calculations.working_capital",
        headerName: "Savings",
        sortable: false,
        suppressMovable: true,
        cellRenderer: CurrencyColorless,
        resizable: false,
        flex: 1,
      },
      {
        headerName: "Actions",
        sortable: false,
        suppressMovable: true,
        cellRenderer: ({
          data: transaction,
          node: { rowIndex },
          api,
        }: {
          data: IApiTransaction;
          node: { rowIndex: number };
          api: GridApi;
        }) => {
          return (
            <>
              <Tippy content={<>Skip</>} singleton={target}>
                <FontAwesomeIcon
                  icon={faForward}
                  style={{ padding: 4 }}
                  onClick={() => {
                    transactionActions.skipTransaction(transaction);
                  }}
                />
              </Tippy>
              <Tippy content={<>Change Date</>} singleton={target}>
                <FontAwesomeIcon
                  icon={faCalendarDays}
                  style={{ padding: 4, marginLeft: 4 }}
                  onClick={() => {
                    api.startEditingCell({
                      rowIndex,
                      colKey: "day",
                    });
                  }}
                />
              </Tippy>
            </>
          );
        },
        resizable: false,
        flex: 1,
      },
    ],
    [transactions, target],
  );

  const gridRef = useRef<AgGridReact<IApiTransaction>>();
  const exportCSV = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: "transactions.csv",
      processCellCallback: (params) => {
        // Check if the value is a number and round it to 2 decimal places
        if (typeof params.value === "number") {
          return Math.round(params.value * 100) / 100;
        }
        return params.value;
      },
    });
  }, []);

  useEffect(() => {
    let isFirstInvocation = true;
    return selectedDate.subscribe((d) => {
      if (isFirstInvocation) {
        isFirstInvocation = false;
        return;
      }
      if (!d) return;

      const index = transactions.findIndex((t) => t.day >= d);
      if (index < 0) return;

      if (!gridRef.current) return;
      const api = gridRef.current.api;

      const node = api.getRowNode(index as any);
      if (node) node.setSelected(true);
    });
  }, [transactions]);

  const onRowSelected = useCallback((event: any) => {
    if (event.node.isSelected()) {
      const rowIndex = event.node.rowIndex;
      if (gridRef.current) {
        gridRef.current.api.ensureIndexVisible(rowIndex, "middle");
      }

      setTimeout(() => {
        (event.node as IRowNode).setSelected(false);
      }, 1000);
    }
  }, []);

  return (
    <div
      className="ag-theme-quartz p-0 pt-2"
      style={{
        position: "relative",
        overflowY: "auto",
        height: "45vh",
      }}
    >
      <Tippy singleton={source} />
      <AgGridReact
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={gridRef as any}
        rowData={transactions}
        columnDefs={columns}
        rowHeight={35}
        headerHeight={35}
        onRowSelected={onRowSelected}
      />
      <Button
        variant="outline-secondary"
        size="sm"
        style={{
          position: "absolute",
          top: 12,
          right: 5,
          zIndex: 1,
        }}
        onClick={exportCSV}
        title="Export to CSV"
      >
        <FontAwesomeIcon icon={faFileCsv} />
      </Button>
    </div>
  );
};
