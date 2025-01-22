import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface YearlyBreakdownProps {
  type: "SIP" | "SWP";
  data: {
    year: string;
    investment?: number;
    balance: number;
    returns?: number;
    withdrawals?: number;
  }[];
  isSmallScreen?: boolean;
}

export function YearlyBreakdown({ type, data, isSmallScreen }: YearlyBreakdownProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Year-by-Year Breakdown
      </ThemedText>

      <View style={styles.table}>
        <View style={styles.headerRow}>
          <ThemedText style={[styles.headerCell, styles.yearCell]}>Year</ThemedText>
          {type === "SIP" ? (
            <>
              <ThemedText style={[styles.headerCell, styles.numberCell]}>Investment</ThemedText>
              <ThemedText style={[styles.headerCell, styles.numberCell]}>Returns</ThemedText>
            </>
          ) : (
            <ThemedText style={[styles.headerCell, styles.numberCell]}>Withdrawals</ThemedText>
          )}
          <ThemedText style={[styles.headerCell, styles.numberCell]}>Balance</ThemedText>
        </View>

        {data.map((row, index) => (
          <View
            key={row.year}
            style={[
              styles.dataRow,
              index % 2 === 0 && { backgroundColor: Colors[colorScheme ?? "light"].subtle },
            ]}
          >
            <ThemedText style={[styles.cell, styles.yearCell]}>{row.year}</ThemedText>
            {type === "SIP" ? (
              <>
                <ThemedText style={[styles.cell, styles.numberCell]}>
                  ₹{row.investment?.toLocaleString()}
                </ThemedText>
                <ThemedText style={[styles.cell, styles.numberCell]}>
                  ₹{row.returns?.toLocaleString()}
                </ThemedText>
              </>
            ) : (
              <ThemedText style={[styles.cell, styles.numberCell]}>
                ₹{row.withdrawals?.toLocaleString()}
              </ThemedText>
            )}
            <ThemedText style={[styles.cell, styles.numberCell]}>₹{row.balance.toLocaleString()}</ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 8,
  },
  headerCell: {
    color: "white",
    fontWeight: "600",
    fontSize: 13,
  },
  cell: {
    fontSize: 13,
  },
  yearCell: {
    flex: 1,
    paddingLeft: 12,
  },
  numberCell: {
    flex: 2,
    textAlign: "right",
    paddingRight: 12,
  },
}); 