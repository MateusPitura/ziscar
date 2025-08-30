import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: "row",
    minHeight: 25,
    borderStyle: "solid",
    borderLeftWidth: 1,
    borderTopWidth: 1,
    borderColor: "#CCCCCC",
    marginTop: 5,
    backgroundColor: "#F3F4F6",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: "#CCCCCC",
    padding: 6,
    justifyContent: "center",
  },
  tableCellHeader: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#374151",
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
