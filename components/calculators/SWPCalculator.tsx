import { useState } from "react";
import { StyleSheet, ScrollView, View, Animated, TouchableOpacity, Platform, Text, useWindowDimensions } from "react-native";
import { ThemedView } from "../ThemedView";
import { InputField } from "./InputField";
import { calculateSWP } from "@/utils/calculations";
import { ResultsChart } from "./ResultsChart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Colors } from "@/constants/Colors";

interface ValidationErrors {
  initialInvestment?: string;
  monthlyWithdrawal?: string;
  returnRate?: string;
  duration?: string;
}

export function SWPCalculator() {
  const insets = useSafeAreaInsets();
  const [initialInvestment, setInitialInvestment] = useState("1000000");
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState("10000");
  const [returnRate, setReturnRate] = useState("12");
  const [duration, setDuration] = useState("10");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showResults, setShowResults] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [results, setResults] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 375 || height < 667;

  const validateInputs = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!initialInvestment || parseFloat(initialInvestment) <= 0) {
      newErrors.initialInvestment = "Please enter a valid initial investment amount";
    }

    if (!monthlyWithdrawal || parseFloat(monthlyWithdrawal) <= 0) {
      newErrors.monthlyWithdrawal = "Please enter a valid monthly withdrawal amount";
    } else if (parseFloat(monthlyWithdrawal) > parseFloat(initialInvestment) / 12) {
      newErrors.monthlyWithdrawal = "Monthly withdrawal cannot exceed 1/12th of initial investment";
    }

    if (!returnRate || parseFloat(returnRate) < 0 || parseFloat(returnRate) > 100) {
      newErrors.returnRate = "Return rate should be between 0 and 100";
    }

    if (!duration || parseInt(duration) <= 0 || parseInt(duration) > 50) {
      newErrors.duration = "Duration should be between 1 and 50 years";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateResults = () => {
    if (!validateInputs()) return;

    const { yearlyBalances, years } = calculateSWP({
      initialInvestment: parseFloat(initialInvestment),
      monthlyWithdrawal: parseFloat(monthlyWithdrawal),
      returnRate: parseFloat(returnRate),
      duration: parseInt(duration),
    });

    setResults({
      labels: years,
      data: yearlyBalances,
    });

    setShowResults(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const resetCalculator = () => {
    setInitialInvestment("1000000");
    setMonthlyWithdrawal("10000");
    setReturnRate("12");
    setDuration("10");
    setErrors({});
    setShowResults(false);
    fadeAnim.setValue(0);
  };

  const totalWithdrawals = parseInt(duration) * 12 * parseFloat(monthlyWithdrawal);
  const finalBalance = results.data[results.data.length - 1] || 0;
  const totalReturns = finalBalance - parseFloat(initialInvestment) + totalWithdrawals;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <ThemedView style={styles.container}>
        <View style={styles.inputContainer}>
          <InputField
            label="Initial Investment"
            value={initialInvestment}
            onChangeText={setInitialInvestment}
            placeholder="Enter amount"
            suffix="₹"
            keyboardType="numeric"
            error={errors.initialInvestment}
            style={styles.input}
          />

          <InputField
            label="Monthly Withdrawal"
            value={monthlyWithdrawal}
            onChangeText={setMonthlyWithdrawal}
            placeholder="Enter amount"
            suffix="₹"
            keyboardType="numeric"
            error={errors.monthlyWithdrawal}
            style={styles.input}
          />

          <InputField
            label="Expected Return"
            value={returnRate}
            onChangeText={setReturnRate}
            placeholder="Enter %"
            suffix="%"
            keyboardType="numeric"
            error={errors.returnRate}
            style={styles.input}
          />

          <InputField
            label="Duration"
            value={duration}
            onChangeText={setDuration}
            placeholder="Years"
            suffix="Years"
            keyboardType="numeric"
            error={errors.duration}
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.calculateButton, styles.buttonShadow]} onPress={calculateResults}>
            <MaterialCommunityIcons name="calculator" size={20} color="white" />
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.resetButton, styles.buttonShadow]} onPress={resetCalculator}>
            <MaterialCommunityIcons name="refresh" size={20} color="#666" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {showResults && (
          <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
            <View style={[styles.card, styles.summaryContainer]}>
              <Text style={styles.cardTitle}>Summary</Text>
              <Text style={styles.summaryText}>Initial Investment: ₹{parseFloat(initialInvestment).toLocaleString()}</Text>
              <Text style={styles.summaryText}>Monthly Withdrawal: ₹{parseFloat(monthlyWithdrawal).toLocaleString()}</Text>
              <Text style={styles.summaryText}>Total Withdrawals: ₹{totalWithdrawals.toLocaleString()}</Text>
              <Text style={styles.summaryText}>Final Balance: ₹{finalBalance.toLocaleString()}</Text>
            </View>

            <View style={[styles.card, styles.phaseContainer]}>
              <Text style={styles.cardTitle}>Portfolio Health</Text>
              <View style={styles.phaseItem}>
                <Text style={styles.phaseLabel}>Capital Preservation</Text>
                <Text style={[styles.phaseValue, { color: finalBalance >= parseFloat(initialInvestment) ? "#4CAF50" : "#FFA726" }]}>
                  {((finalBalance / parseFloat(initialInvestment)) * 100).toFixed(1)}% of initial
                </Text>
              </View>

              <View style={styles.phaseItem}>
                <Text style={styles.phaseLabel}>Withdrawal Rate</Text>
                <Text style={styles.phaseValue}>
                  {(((parseFloat(monthlyWithdrawal) * 12) / parseFloat(initialInvestment)) * 100).toFixed(1)}% yearly
                </Text>
              </View>

              <View style={styles.phaseItem}>
                <Text style={styles.phaseLabel}>Years of Coverage</Text>
                <Text style={[styles.phaseValue, { color: finalBalance > 0 ? "#4CAF50" : "#F44336" }]}>
                  {finalBalance > 0
                    ? `${duration} years+`
                    : `${Math.floor((results.data.findIndex((balance) => balance <= 0) / results.data.length) * parseInt(duration))} years`}
                </Text>
              </View>
            </View>

            <View style={[styles.card, styles.insightContainer]}>
              <Text style={styles.cardTitle}>Recommendation</Text>
              <Text style={styles.insightText}>
                {finalBalance > parseFloat(initialInvestment) * 0.8
                  ? "✓ Your withdrawal plan is highly sustainable. The portfolio maintains most of its value while providing regular income."
                  : finalBalance > 0
                  ? "⚠️ Consider reducing withdrawals to preserve capital for longer-term sustainability."
                  : "❌ This withdrawal rate depletes your portfolio. Consider reducing monthly withdrawals or exploring other income sources."}
              </Text>
            </View>
          </Animated.View>
        )}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: Platform.select({
      ios: 12,
      android: 12,
      default: 16,
    }),
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  buttonShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  calculateButton: {
    flexDirection: "row",
    backgroundColor: Colors.light.tint,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  resetButton: {
    flexDirection: "row",
    backgroundColor: Platform.select({
      ios: "rgba(0,0,0,0.03)",
      android: "rgba(0,0,0,0.03)",
      default: "#F8FAFC",
    }),
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  resetButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  resultsContainer: {
    backgroundColor: Platform.select({
      ios: "rgba(248, 250, 252, 0.9)",
      android: "#F8FAFC",
      default: "rgba(248, 250, 252, 0.9)",
    }),
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    gap: 12,
  },
  card: {
    padding: 16,
    backgroundColor: "white",
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
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  summaryContainer: {
    marginBottom: 24,
  },
  summaryText: {
    fontSize: 14,
    color: "#666",
  },
  phaseContainer: {
    marginBottom: 24,
  },
  phaseItem: {
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  phaseValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  insightContainer: {
    marginBottom: 24,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
});
