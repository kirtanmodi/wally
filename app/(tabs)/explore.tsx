import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity, Platform, Alert, useWindowDimensions } from "react-native";
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
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();

  // Dynamic styles based on color scheme
  const dynamicStyles = {
    historyItem: {
      backgroundColor: Platform.select({
        web: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 249, 250, 0.8)',
        default: Colors[colorScheme ?? 'light'].card,
      }),
      ...Platform.select({
        web: {
          backdropFilter: "blur(10px)",
          boxShadow: colorScheme === "dark" ? "0 4px 6px rgba(0, 0, 0, 0.3)" : "0 4px 6px rgba(0, 0, 0, 0.1)",
        },
        default: {
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: colorScheme === "dark" ? 0.3 : 0.2,
          shadowRadius: 1.41,
        },
      }),
    },
    detailCard: {
      backgroundColor: Platform.select({
        ios: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        android: Colors[colorScheme ?? 'light'].background,
        default: Colors[colorScheme ?? 'light'].background,
      }),
    },
    emptyState: {
      backgroundColor: Platform.select({
        web: colorScheme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(248, 249, 250, 0.8)',
        default: Colors[colorScheme ?? 'light'].card,
      }),
    },
  };

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
      <ThemedView style={[dynamicStyles.detailCard, { padding: isSmallScreen ? 12 : 16 }]}>
        <View style={styles.detailHeader}>
          <ThemedText type="subtitle" style={isSmallScreen ? styles.smallTitle : undefined}>
            {item.type} Calculation Details
          </ThemedText>
          <ThemedText style={styles.date}>{format(new Date(item.date), isSmallScreen ? "PP" : "PPp")}</ThemedText>
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
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: insets.top + (isSmallScreen ? 12 : 16),
          paddingBottom: insets.bottom + (isSmallScreen ? 12 : 16),
          paddingHorizontal: isSmallScreen ? 12 : 16,
        },
      ]}
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
        <ThemedView style={dynamicStyles.emptyState}>
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
              style={[
                styles.historyItem,
                dynamicStyles.historyItem,
                selectedItem === item.id && styles.selectedItem
              ]}
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
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  clearButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    borderRadius: 16,
  },
  emptyStateText: {
    marginTop: 16,
    textAlign: "center",
  },
  emptyStateSubtext: {
    marginTop: 8,
    textAlign: "center",
    opacity: 0.7,
  },
  historyList: {
    gap: 12,
  },
  historyItem: {
    borderRadius: 16,
    padding: 16,
  },
  selectedItem: {
    borderWidth: 2,
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
    fontSize: 15,
  },
  smallTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  detailCard: {
    marginTop: 12,
    borderRadius: 12,
  },
  detailHeader: {
    marginBottom: 12,
  },
  date: {
    opacity: 0.6,
    fontSize: 13,
    marginTop: 4,
  },
  detailSection: {
    marginBottom: 12,
  },
  detailText: {
    marginTop: 6,
    opacity: 0.7,
    fontSize: 14,
  },
});
