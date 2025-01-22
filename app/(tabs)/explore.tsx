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
        web: colorScheme === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(248, 249, 250, 0.8)",
        default: Colors[colorScheme ?? "light"].card,
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
        ios: colorScheme === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(255, 255, 255, 0.8)",
        android: Colors[colorScheme ?? "light"].background,
        default: Colors[colorScheme ?? "light"].background,
      }),
    },
    emptyState: {
      backgroundColor: Platform.select({
        web: colorScheme === "dark" ? "rgba(30, 41, 59, 0.8)" : "rgba(248, 249, 250, 0.8)",
        default: Colors[colorScheme ?? "light"].card,
      }),
    },
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const savedHistory = await AsyncStorage.getItem("calculationHistory");
      console.log(savedHistory);
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

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tableContainer}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <View style={[styles.tableCell, styles.headerCell]}>
                <ThemedText type="defaultSemiBold" style={styles.headerText}>
                  Parameter
                </ThemedText>
              </View>
              <View style={[styles.tableCell, styles.headerCell]}>
                <ThemedText type="defaultSemiBold" style={styles.headerText}>
                  Value
                </ThemedText>
              </View>
            </View>

            {/* Input Parameters Section */}
            <View style={styles.tableSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>
                Input Parameters
              </ThemedText>
              {item.type === "SIP" ? (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Monthly Investment</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.params.monthlyInvestment?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Inflation Rate</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>{item.params.inflationRate}%</ThemedText>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Initial Investment</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.params.initialInvestment?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Monthly Withdrawal</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.params.monthlyWithdrawal?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                </>
              )}
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <ThemedText style={styles.cellLabel}>Return Rate</ThemedText>
                </View>
                <View style={styles.tableCell}>
                  <ThemedText style={styles.cellValue}>{item.params.returnRate}%</ThemedText>
                </View>
              </View>
              <View style={styles.tableRow}>
                <View style={styles.tableCell}>
                  <ThemedText style={styles.cellLabel}>Duration</ThemedText>
                </View>
                <View style={styles.tableCell}>
                  <ThemedText style={styles.cellValue}>{item.params.duration} years</ThemedText>
                </View>
              </View>
            </View>

            {/* Results Section */}
            <View style={styles.tableSection}>
              <ThemedText type="defaultSemiBold" style={styles.sectionHeader}>
                Results
              </ThemedText>
              {item.type === "SIP" ? (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Total Investment</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.results.totalInvestment?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Expected Returns</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.results.expectedReturns?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Total Value</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.results.totalValue?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Total Withdrawals</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.results.totalWithdrawals?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellLabel}>Final Balance</ThemedText>
                    </View>
                    <View style={styles.tableCell}>
                      <ThemedText style={styles.cellValue}>₹{item.results.finalBalance?.toLocaleString()}</ThemedText>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </ScrollView>
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
          {history.length > 0 && history.map((item, index) => {
            if (!item) {
              console.warn(`Invalid history item at index ${index}`);
              return null;
            }
            if (!item?.id || !item?.type) {
              console.warn("Invalid history item:", item);
              return null;
            }

            const iconName = item.type === "SIP" ? "chart-line" : "chart-timeline-variant";
            const isSelected = selectedItem === item.id;

            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.historyItem, dynamicStyles.historyItem, isSelected && styles.selectedItem]}
                onPress={() => setSelectedItem(isSelected ? null : item.id)}
                accessible={true}
                accessibilityLabel={`${item.type} calculation history item`}
                accessibilityHint="Double tap to view calculation details"
              >
                <View style={styles.itemHeader}>
                  <View style={styles.typeContainer}>
                    <MaterialCommunityIcons name={iconName} size={24} color={Colors[colorScheme ?? "light"].text} />
                    <ThemedText type="defaultSemiBold" style={styles.itemType}>
                      {item.type} Calculation
                    </ThemedText>
                  </View>
                  <MaterialCommunityIcons name={isSelected ? "chevron-up" : "chevron-down"} size={24} color={Colors[colorScheme ?? "light"].text} />
                </View>
                {isSelected && renderDetailCard(item)}
              </TouchableOpacity>
              );
            })} 
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
  tableContainer: {
    minWidth: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: Platform.select({
      ios: "rgba(0,0,0,0.02)",
      android: "rgba(0,0,0,0.04)",
      default: "rgba(0,0,0,0.02)",
    }),
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerCell: {
    backgroundColor: Platform.select({
      ios: "rgba(0,0,0,0.02)",
      android: "rgba(0,0,0,0.04)",
      default: "rgba(0,0,0,0.02)",
    }),
  },
  tableSection: {
    marginTop: 16,
  },
  sectionHeader: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Platform.select({
      ios: "rgba(0,0,0,0.01)",
      android: "rgba(0,0,0,0.02)",
      default: "rgba(0,0,0,0.01)",
    }),
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  tableCell: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  headerText: {
    fontSize: 14,
    color: Platform.select({
      ios: "#666",
      android: "#555",
      default: "#666",
    }),
  },
  cellLabel: {
    fontSize: 13,
    color: "#666",
  },
  cellValue: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
});
