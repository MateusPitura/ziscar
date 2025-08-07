import safeFormat from "@/domains/global/utils/safeFormat";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
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

interface ReportHeaderProperties {
  appliedFilters: Record<string, string>;
  title: string;
}

export default function ReportHeader({
  appliedFilters,
  title,
}: ReportHeaderProperties): ReactNode {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>
          Gerado em {safeFormat({ date: new Date(), format: "dd/MM/yyyy" })}
        </Text>
      </View>
      {appliedFilters && Object.keys(appliedFilters).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtros aplicados</Text>
          <View style={styles.summary}>
            {Object.entries(appliedFilters).map(([key, value]) => (
              <Text key={key} style={styles.summaryText}>
                • {key}: {value}
              </Text>
            ))}
          </View>
        </View>
      )}
    </>
  );
}
