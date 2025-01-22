import { StyleSheet, useWindowDimensions, Platform, ScrollView } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ResultsChartProps {
  data: number[];
  labels: string[];
  title: string;
}

export function ResultsChart({ data, labels, title }: ResultsChartProps) {
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();

  // Adjusted chart width calculation with more padding for mobile
  const chartWidth = Platform.select({
    web: Math.min(width - 48, 1200),
    ios: width - 64, // More padding for iOS
    default: Math.min(width - 48, 800),
  });

  // Transform data into the format expected by gifted-charts
  const chartData = data.map((value, index) => ({
    value,
    label: labels[index],
    labelComponent: () => <ThemedText style={styles.label}>{labels[index]}</ThemedText>,
  }));

  const formatYLabel = (value: number) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    }
    return `₹${(value / 1000).toFixed(0)}K`;
  };

  return (
    <ScrollView horizontal contentContainerStyle={{ alignItems: "center" }}>
      <ThemedView style={styles.container}>
        <ThemedText type="subtitle" style={styles.title}>
          {title}
        </ThemedText>
        <ThemedView style={[styles.chartWrapper, Platform.OS === "web" && styles.webChartWrapper]}>
          <LineChart
            data={chartData}
            width={chartWidth}
            height={220}
            hideDataPoints={false}
            spacing={chartWidth / (data.length * 2)}
            color={Colors[colorScheme ?? "light"].tint}
            thickness={2}
            startFillColor={`${Colors[colorScheme ?? "light"].tint}33`}
            endFillColor={`${Colors[colorScheme ?? "light"].tint}00`}
            initialSpacing={30}
            endSpacing={30}
            noOfSections={6}
            maxValue={Math.max(...data) * 1.1}
            yAxisLabelWidth={70}
            yAxisTextStyle={styles.yAxisText}
            xAxisLabelTextStyle={styles.xAxisText}
            rulesColor={`${Colors[colorScheme ?? "light"].text}20`}
            rulesType="solid"
            yAxisLabelPrefix="₹"
            yAxisLabelSuffix=""
            formatYLabel={(label: string) => formatYLabel(Number(label))}
            curved
            areaChart
            isAnimated
            animationDuration={1000}
            pointerConfig={{
              pointerStripHeight: 160,
              pointerStripColor: `${Colors[colorScheme ?? "light"].text}20`,
              pointerStripWidth: 2,
              pointerColor: Colors[colorScheme ?? "light"].tint,
              radius: 6,
              pointerLabelWidth: 100,
              pointerLabelHeight: 40,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: true,
              pointerLabelComponent: (items: any) => (
                <ThemedView style={styles.tooltip}>
                  <ThemedText style={styles.tooltipText}>{formatYLabel(items[0].value)}</ThemedText>
                </ThemedView>
              ),
            }}
          />
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 24,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  chartWrapper: {
    alignItems: "center",
    width: "100%",
    padding: Platform.OS === "web" ? 24 : 16,
  },
  webChartWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  yAxisText: {
    fontSize: 12,
    color: Platform.OS === "web" ? "#666" : "#888",
  },
  xAxisText: {
    fontSize: 12,
    color: Platform.OS === "web" ? "#666" : "#888",
    width: 60,
    textAlign: "center",
  },
  tooltip: {
    backgroundColor: "white",
    padding: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  tooltipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});
