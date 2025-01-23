import { StyleSheet, View, Platform } from "react-native";
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
  const isDark = colorScheme === "dark";

  const dynamicStyles = {
    table: {
      borderColor: Colors[colorScheme].subtle,
    },
    headerRow: {
      backgroundColor: Colors[colorScheme].tint,
    },
    alternateRow: {
      backgroundColor: isDark ? "rgba(255, 255, 255, 0.05)" : Colors[colorScheme].subtle,
    },
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="defaultSemiBold" style={styles.title}>
        Year-by-Year Breakdown
      </ThemedText>

      <View style={[styles.table, dynamicStyles.table]}>
        <View style={[styles.headerRow, dynamicStyles.headerRow]}>
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
          <View key={row.year} style={[styles.dataRow, index % 2 === 0 && dynamicStyles.alternateRow]}>
            <ThemedText style={[styles.cell, styles.yearCell]}>{row.year}</ThemedText>
            {type === "SIP" ? (
              <>
                <ThemedText style={[styles.cell, styles.numberCell]}>₹{row.investment?.toLocaleString()}</ThemedText>
                <ThemedText style={[styles.cell, styles.numberCell]}>₹{row.returns?.toLocaleString()}</ThemedText>
              </>
            ) : (
              <ThemedText style={[styles.cell, styles.numberCell]}>₹{row.withdrawals?.toLocaleString()}</ThemedText>
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
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  title: {
    marginBottom: 8,
  },
  date: {
    opacity: 0.6,
    marginBottom: 24,
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Colors.light.subtle,
  },
  headerRow: {
    flexDirection: "row",
    backgroundColor: Colors.light.tint,
    paddingVertical: 12,
  },
  dataRow: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  headerCell: {
    color: Colors.light.background,
    fontWeight: "600",
    fontSize: 14,
  },
  cell: {
    fontSize: 14,
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
  emptyText: {
    marginTop: 16,
    textAlign: "center",
  },
});
