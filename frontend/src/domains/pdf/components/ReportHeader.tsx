import safeFormat from "@/domains/global/utils/safeFormat";
import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { ReactNode } from "react";

const styles = StyleSheet.create({
  header: {
    height: 40,
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 10,
    backgroundColor: "#FFFFFF",
  },
  gridColumn: {
    flex: 1,
    minHeight: 40,
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
  logoContainer: {
    marginBottom: "-20px",
    marginTop: "-20px",
    marginLeft: "-10px",
  },
});

interface ReportHeaderProperties {
  title: string;
}

export default function ReportHeader({
  title,
}: ReportHeaderProperties): ReactNode {
  return (
    <View style={styles.header} fixed>
      <View style={styles.gridColumn}>
        <View style={styles.logoContainer}>
          <Image src="/FullLogo.png" style={{ width: 160, height: 90 }} />
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

      <View style={styles.gridColumn} />
    </View>
  );
}
