import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReactElement } from "react";
import ReportHeader from "./ReportHeader";
import TableHeader from "./TableHeader";
import PageFooter from "./PageFooter";
import { isNumericColumn } from "../utils";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 15,
    paddingBottom: 25,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    textAlign: "center",
    marginTop: 30,
  },
  emptyText: {
    fontSize: 16,
    color: "#666666",
  },
  tableContainer: {
    marginTop: 0,
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 20,
  },
  tableRowAlternate: {
    backgroundColor: "#F0F0F0",
  },
  tableCol: {
    borderStyle: "solid",
    borderLeftWidth: 0.25,
    borderColor: "#DDDDDD",
    padding: 4,
    justifyContent: "center",
  },
  tableColNumeric: {
    alignItems: "flex-end",
  },
  tableCell: {
    fontSize: 10,
    color: "#000000",
  },
});

interface ReportProperties<T> {
  data: T[];
  formatColumns: Record<string, string | undefined>;
  title: string;
  appliedFilters: Record<string, string>;
}

function Report<T>({
  data,
  formatColumns,
  title,
  appliedFilters,
}: ReportProperties<T>): ReactElement {
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <ReportHeader appliedFilters={appliedFilters} title={title} />
          <View style={styles.content}>
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Nenhum dado encontrado</Text>
            </View>
          </View>
          <PageFooter totalRecords={0} itemsPerPage={16} />
        </Page>
      </Document>
    );
  }

  const keys = Object.keys(formatColumns).filter(
    (key) =>
      formatColumns[key] &&
      (data[0] as Record<string, unknown>)?.[key] !== undefined
  );
  const columnWidth = `${100 / keys.length}%`;
  const itemsPerPage = 22;

  const formatValue = (value: unknown, key: string): string => {
    if (key === "archivedAt") return value ? "Não" : "Sim";
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Sim" : "Não";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
  };

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <ReportHeader appliedFilters={appliedFilters} title={title} />

        <TableHeader
          keys={keys}
          formatColumns={formatColumns}
          columnWidth={columnWidth}
        />

        <View style={styles.content}>
          <View style={styles.tableContainer}>
            {data.map((item, index) => (
              <View
                style={[
                  styles.tableRow,
                  ...(index % 2 === 1 ? [styles.tableRowAlternate] : []),
                ]}
                key={`row-${index}`}
                wrap={false}
                minPresenceAhead={8}
              >
                {keys.map((key) => {
                  const isMonetary = isNumericColumn(key);
                  return (
                    <View
                      key={key}
                      style={[
                        styles.tableCol,
                        { width: columnWidth },
                        ...(isMonetary ? [styles.tableColNumeric] : []),
                      ]}
                    >
                      <Text style={styles.tableCell}>
                        {formatValue(
                          (item as Record<string, unknown>)[key],
                          key
                        )}
                      </Text>
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
        </View>

        <PageFooter totalRecords={data.length} itemsPerPage={itemsPerPage} />
      </Page>
    </Document>
  );
}

export default Report;
