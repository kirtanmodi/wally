import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Platform, Alert } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

interface CalculationHistory {
  id: string;
  type: "SIP" | "SWP";
  date: string;
  params: {
    monthlyInvestment?: number;
    returnRate: number;
    duration: number;
    inflationRate?: number;
    initialInvestment?: number;
    monthlyWithdrawal?: number;
  };
  results: {
    totalInvestment?: number;
    expectedReturns?: number;
    totalValue?: number;
    totalWithdrawals?: number;
    finalBalance?: number;
  };
}

export default function ExploreScreen() {
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("calculationHistory");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load calculation history");
    }
  };

  const clearHistory = async () => {
    Alert.alert("Clear History", "Are you sure you want to clear all calculation history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("calculationHistory");
            setHistory([]);
            setSelectedItem(null);
          } catch (error) {
            Alert.alert("Error", "Failed to clear history");
          }
        },
      },
    ]);
  };

  const renderDetailCard = (item: CalculationHistory) => {
    return (
      <ThemedView style={styles.detailCard}>
        <View style={styles.detailHeader}>
          <ThemedText type="subtitle">{item.type} Calculation Details</ThemedText>
          <ThemedText style={styles.date}>{format(new Date(item.date), "PPp")}</ThemedText>
        </View>

        <View style={styles.detailSection}>
          <ThemedText type="defaultSemiBold">Input Parameters</ThemedText>
          {item.type === "SIP" && (
            <>
              <ThemedText style={styles.detailText}>Monthly Investment: ₹{item.params.monthlyInvestment?.toLocaleString()}</ThemedText>
              <ThemedText style={styles.detailText}>Inflation Rate: {item.params.inflationRate}%</ThemedText>
            </>
          )}
          {item.type === "SWP" && (
            <>
              <ThemedText style={styles.detailText}>Initial Investment: ₹{item.params.initialInvestment?.toLocaleString()}</ThemedText>
              <ThemedText style={styles.detailText}>Monthly Withdrawal: ₹{item.params.monthlyWithdrawal?.toLocaleString()}</ThemedText>
            </>
          )}
          <ThemedText style={styles.detailText}>Return Rate: {item.params.returnRate}%</ThemedText>
          <ThemedText style={styles.detailText}>Duration: {item.params.duration} years</ThemedText>
        </View>

        <View style={styles.detailSection}>
          <ThemedText type="defaultSemiBold">Results</ThemedText>
          {item.type === "SIP" && (
            <>
              <ThemedText style={styles.detailText}>Total Investment: ₹{item.results.totalInvestment?.toLocaleString()}</ThemedText>
              <ThemedText style={styles.detailText}>Expected Returns: ₹{item.results.expectedReturns?.toLocaleString()}</ThemedText>
              <ThemedText style={styles.detailText}>Total Value: ₹{item.results.totalValue?.toLocaleString()}</ThemedText>
            </>
          )}
          {item.type === "SWP" && (
            <>
              <ThemedText style={styles.detailText}>Total Withdrawals: ₹{item.results.totalWithdrawals?.toLocaleString()}</ThemedText>
              <ThemedText style={styles.detailText}>Final Balance: ₹{item.results.finalBalance?.toLocaleString()}</ThemedText>
            </>
          )}
        </View>
      </ThemedView>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 }]}
    >
      <View style={styles.header}>
        <ThemedText type="title">Calculation History</ThemedText>
        {history.length > 0 && (
          <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
            <MaterialCommunityIcons name="delete-outline" size={24} color={Colors[colorScheme ?? "light"].text} />
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <ThemedView style={styles.emptyState}>
          <MaterialCommunityIcons name="calculator-variant" size={48} color={Colors[colorScheme ?? "light"].icon} />
          <ThemedText type="subtitle" style={styles.emptyStateText}>
            No calculations yet
          </ThemedText>
          <ThemedText style={styles.emptyStateSubtext}>Your calculation history will appear here</ThemedText>
        </ThemedView>
      ) : (
        <View style={styles.historyList}>
          {history.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.historyItem, selectedItem === item.id && styles.selectedItem]}
              onPress={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <View style={styles.itemHeader}>
                <View style={styles.typeContainer}>
                  <MaterialCommunityIcons
                    name={item.type === "SIP" ? "chart-line" : "chart-timeline-variant"}
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                  />
                  <ThemedText type="defaultSemiBold" style={styles.itemType}>
                    {item.type} Calculation
                  </ThemedText>
                </View>
                <MaterialCommunityIcons
                  name={selectedItem === item.id ? "chevron-up" : "chevron-down"}
                  size={24}
                  color={Colors[colorScheme ?? "light"].text}
                />
              </View>
              {selectedItem === item.id && renderDetailCard(item)}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  clearButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    borderRadius: 16,
    backgroundColor: Platform.select({
      web: "rgba(248, 249, 250, 0.8)",
      default: "#F8F9FA",
    }),
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    marginTop: 8,
    textAlign: "center",
    color: "#666",
  },
  historyList: {
    gap: 16,
  },
  historyItem: {
    borderRadius: 16,
    backgroundColor: Platform.select({
      web: "rgba(248, 249, 250, 0.8)",
      default: "#F8F9FA",
    }),
    padding: 16,
    ...Platform.select({
      web: {
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      },
      default: {
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
      },
    }),
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: Colors.light.tint,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemType: {
    fontSize: 16,
  },
  detailCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "white",
  },
  detailHeader: {
    marginBottom: 16,
  },
  date: {
    color: "#666",
    fontSize: 14,
    marginTop: 4,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailText: {
    marginTop: 8,
    color: "#666",
  },
});
