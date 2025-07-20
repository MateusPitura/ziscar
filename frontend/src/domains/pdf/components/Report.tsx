import { FetchUser } from "@/domains/global/types/model";
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
  },
  tableHeader: {
    backgroundColor: "#F3F4F6",
  },
  tableColHeader: {
    width: "16.66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#CCCCCC",
    padding: 8,
  },
  tableCol: {
    width: "16.66%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#CCCCCC",
    padding: 8,
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

interface ReportProperties {
  data?: FetchUser[];
}

function Report({ data }: ReportProperties): ReactElement {
  const activeUsers = data?.filter((user) => user.isActive).length;
  const inactiveUsers = data?.filter((user) => user.isActive === false).length;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Relatório de Usuários</Text>
          <Text style={styles.subtitle}>
            Gerado em {safeFormat({ date: new Date(), format: "dd/MM/yyyy" })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lista de usuários</Text>

          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>ID</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Nome completo</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Email</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Celular</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Status</Text>
              </View>
            </View>

            {data?.map((user) => (
              <View style={styles.tableRow} key={user.id}>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{user.id}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{user.fullName}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{user.email}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={styles.tableCell}>{user.cellPhone || "-"}</Text>
                </View>
                <View style={styles.tableCol}>
                  <Text style={[styles.tableCell]}>
                    {user.isActive ? "Ativo" : "Inativo"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>

          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              • Total de usuários: {data?.length}
            </Text>
            <Text style={styles.summaryText}>
              • Usuários ativos: {activeUsers}
            </Text>
            <Text style={styles.summaryText}>
              • Usuários inativos: {inactiveUsers}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default Report;
