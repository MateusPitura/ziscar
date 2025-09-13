import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    minHeight: 20,
    marginTop: 3,
    backgroundColor: "#F8F9FA",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderLeftWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: "#DDDDDD",
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  tableCellHeader: {
    fontSize: 11,
    fontWeight: "bold",
  },
});

interface TableHeaderProperties {
  keys: string[];
  formatColumns: Record<string, string | undefined>;
  columnWidth: string;
}

export default function TableHeader({
  keys,
  formatColumns,
  columnWidth,
}: TableHeaderProperties): ReactNode {
  return (
    <View style={styles.tableRow} fixed>
      {keys.map((key) => (
        <View key={key} style={[styles.tableColHeader, { width: columnWidth }]}>
          <Text style={styles.tableCellHeader}>{formatColumns[key]}</Text>
        </View>
      ))}
    </View>
  );
}
