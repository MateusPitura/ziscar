import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReactElement } from "react";
import ReportHeader from "./ReportHeader";
import TableHeader from "./TableHeader";
import PageFooter from "./PageFooter";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    paddingBottom: 30,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    textAlign: "center",
    marginTop: 50,
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
    minHeight: 25,
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
  },
  tableRowAlternate: {
    backgroundColor: "#F9FAFB",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#CCCCCC",
    padding: 6,
    justifyContent: "center",
  },
  tableCell: {
    fontSize: 8,
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

  const keys = Object.keys(data[0] || {}).filter((key) => formatColumns[key]);
  const columnWidth = `${100 / keys.length}%`;
  const itemsPerPage = 16;

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
                minPresenceAhead={10}
              >
                {keys.map((key) => (
                  <View
                    key={key}
                    style={[styles.tableCol, { width: columnWidth }]}
                  >
                    <Text style={styles.tableCell}>
                      {formatValue((item as Record<string, unknown>)[key], key)}
                    </Text>
                  </View>
                ))}
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
