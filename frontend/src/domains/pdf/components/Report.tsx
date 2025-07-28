import safeFormat from "@/domains/global/utils/safeFormat";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ReactElement } from "react";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#000000",
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: "#666666",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
  },
  table: {
    width: "auto",
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    minHeight: 30,
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
  },
  tableRowAlternate: {
    backgroundColor: "#F9FAFB",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#CCCCCC",
    padding: 8,
    justifyContent: "center",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#CCCCCC",
    padding: 8,
    justifyContent: "center",
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
  },
  tableCell: {
    fontSize: 9,
    color: "#000000",
  },
  summary: {
    padding: 15,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
  },
  summaryText: {
    fontSize: 12,
    marginBottom: 5,
    color: "#374151",
  },
});

interface ReportProperties<T> {
  data: T[];
  formatColumns: Record<string, string | undefined>;
}

function Report<T>({ data, formatColumns }: ReportProperties<T>): ReactElement {
  if (!data || data.length === 0) {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.header}>
            <Text style={styles.title}>Relatório</Text>
            <Text style={styles.subtitle}>
              Gerado em {safeFormat({ date: new Date(), format: "dd/MM/yyyy" })}
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nenhum dado encontrado</Text>
          </View>
        </Page>
      </Document>
    );
  }

  const keys = Object.keys(data[0] || {}).filter((key) => formatColumns[key]);
  const columnWidth = `${100 / keys.length}%`;

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
        <View style={styles.header}>
          <Text style={styles.title}>Relatório</Text>
          <Text style={styles.subtitle}>
            Gerado em {safeFormat({ date: new Date(), format: "dd/MM/yyyy" })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista de dados</Text>

          <View style={[styles.tableRow, styles.tableHeader]}>
            {keys.map((key) => (
              <View
                key={key}
                style={[styles.tableColHeader, { width: columnWidth }]}
              >
                <Text style={styles.tableCellHeader}>{formatColumns[key]}</Text>
              </View>
            ))}
          </View>

          {data.map((item, index) => (
            <View
              style={[
                styles.tableRow,
                ...(index % 2 === 1 ? [styles.tableRowAlternate] : []),
              ]}
              key={`row-${index}`}
              wrap={false}
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              • Total de registros: {data.length}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default Report;
