import safeFormat from "@/domains/global/utils/safeFormat";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
    paddingBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  gridColumn: {
    flex: 1,
    minHeight: 50,
  },
  logoContainer: {
    height: 40,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  logoText: {
    fontSize: 8,
    color: "#9CA3AF",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 3,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignContent: "flex-start",
    marginLeft: 10,
  },
  filterChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 3,
    marginLeft: 3,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterText: {
    fontSize: 8,
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
    <View style={styles.header} fixed>
      <View style={styles.gridColumn}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>LOGO</Text>
        </View>
      </View>

      <View style={styles.gridColumn}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Gerado em {safeFormat({ date: new Date(), format: "dd/MM/yyyy" })}
          </Text>
        </View>
      </View>

      <View style={styles.gridColumn}>
        {appliedFilters && Object.keys(appliedFilters).length > 0 && (
          <View style={styles.filtersContainer}>
            {Object.entries(appliedFilters).map(([key, value]) => (
              <View key={key} style={styles.filterChip}>
                <Text style={styles.filterText}>
                  {key}: {value}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}
