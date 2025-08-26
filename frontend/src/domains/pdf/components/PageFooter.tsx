import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
    paddingTop: 10,
  },
  recordsCounter: {
    fontSize: 10,
    color: "#666666",
    flex: 1,
    textAlign: "center",
  },
  pageNumber: {
    fontSize: 10,
    color: "#666666",
  },
});

interface PageFooterProperties {
  totalRecords: number;
  itemsPerPage: number;
}

export default function PageFooter({
  totalRecords,
  itemsPerPage,
}: PageFooterProperties): ReactNode {
  return (
    <View style={styles.footer} fixed>
      <View style={{ width: 60 }} />
      <Text
        style={styles.recordsCounter}
        render={({ pageNumber }) => {
          const startRecord = (pageNumber - 1) * itemsPerPage;
          const endRecord = Math.min(startRecord + itemsPerPage, totalRecords);

          return `${startRecord + 1} a ${endRecord} de ${totalRecords} itens`;
        }}
      />
      <Text
        style={styles.pageNumber}
        render={({ pageNumber, totalPages }) =>
          `Página ${pageNumber}/${totalPages}`
        }
      />
    </View>
  );
}
