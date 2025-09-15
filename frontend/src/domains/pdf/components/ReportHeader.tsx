import safeFormat from "@/domains/global/utils/safeFormat";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  gridColumn: {
    flex: 1,
    minHeight: 40,
  },
  // logoContainer: {
  //   height: 50,
  //   backgroundColor: "#F8F9FA",
  //   borderRadius: 3,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginRight: 8,
  // },
  logoText: {
    fontSize: 7,
    color: "#9CA3AF",
  },
  centerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 9,
    color: "#666666",
    textAlign: "center",
  },
  filtersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    alignContent: "flex-start",
    marginLeft: 8,
  },
  filterChip: {
    backgroundColor: "#F8F9FA",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginBottom: 2,
    marginLeft: 2,
    borderWidth: 0.5,
    borderColor: "#E5E7EB",
  },
  filterText: {
    fontSize: 7,
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
        <View>
          <Image
            src="/somente-logo.png"
            style={{ width: 40, height: 40 }}
          />
        </View>
      </View>

      <View style={styles.gridColumn}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Gerado em{" "}
            {safeFormat({ date: new Date(), format: "dd/MM/yyyy HH:mm" })}
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
