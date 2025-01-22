import { useState } from "react";
import { StyleSheet, ScrollView, View, Animated, TouchableOpacity, Platform, Text } from "react-native";
import { ThemedView } from "../ThemedView";
import { InputField } from "./InputField";
import { calculateSWP } from "@/utils/calculations";
import { ResultsChart } from "./ResultsChart";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
            label="Expected Return Rate"
            value={returnRate}
            onChangeText={setReturnRate}
            placeholder="Enter percentage"
            suffix="%"
            keyboardType="numeric"
            error={errors.returnRate}
            style={styles.input}
          />

          <InputField
            label="Duration"
            value={duration}
            onChangeText={setDuration}
            placeholder="Enter years"
            suffix="Years"
            keyboardType="numeric"
            error={errors.duration}
            style={styles.input}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.calculateButton} onPress={calculateResults}>
            <MaterialCommunityIcons name="calculator" size={24} color="white" />
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.resetButton} onPress={resetCalculator}>
            <MaterialCommunityIcons name="refresh" size={24} color="#666" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </View>

        {showResults && (
          <Animated.View style={[styles.resultsContainer, { opacity: fadeAnim }]}>
            {/* <ResultsChart data={results.data} labels={results.labels} title="Portfolio Balance Over Time" /> */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Withdrawal Analysis</Text>

              <View style={styles.metricsGrid}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Initial Investment</Text>
                  <Text style={styles.metricValue}>₹{parseFloat(initialInvestment).toLocaleString()}</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Monthly Withdrawal</Text>
                  <Text style={styles.metricValue}>₹{parseFloat(monthlyWithdrawal).toLocaleString()}</Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Withdrawal Rate</Text>
                  <Text style={styles.metricValue}>
                    {(((parseFloat(monthlyWithdrawal) * 12) / parseFloat(initialInvestment)) * 100).toFixed(1)}% yearly
                  </Text>
                </View>

                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Total Withdrawals</Text>
                  <Text style={styles.metricValue}>₹{totalWithdrawals.toLocaleString()}</Text>
                </View>
              </View>

              <View style={styles.sustainabilityCard}>
                <Text style={styles.sustainabilityTitle}>Portfolio Health</Text>

                <View style={styles.healthMetrics}>
                  <View style={styles.healthItem}>
                    <Text style={styles.healthLabel}>Capital Preservation</Text>
                    <Text style={[styles.healthValue, { color: finalBalance >= parseFloat(initialInvestment) ? "#4CAF50" : "#FFA726" }]}>
                      {((finalBalance / parseFloat(initialInvestment)) * 100).toFixed(1)}% of initial
                    </Text>
                  </View>

                  <View style={styles.healthItem}>
                    <Text style={styles.healthLabel}>Years of Coverage</Text>
                    <Text style={[styles.healthValue, { color: finalBalance > 0 ? "#4CAF50" : "#F44336" }]}>
                      {finalBalance > 0
                        ? `${duration} years+`
                        : `${Math.floor((results.data.findIndex((balance) => balance <= 0) / results.data.length) * parseInt(duration))} years`}
                    </Text>
                  </View>
                </View>

                <View style={styles.recommendationBox}>
                  <Text style={styles.recommendationTitle}>Recommendation</Text>
                  <Text style={styles.recommendationText}>
                    {finalBalance > parseFloat(initialInvestment) * 0.8
                      ? "✓ Your withdrawal plan is highly sustainable. The portfolio maintains most of its value while providing regular income."
                      : finalBalance > 0
                      ? "⚠️ Consider reducing withdrawals to preserve capital for longer-term sustainability."
                      : "❌ This withdrawal rate depletes your portfolio. Consider reducing monthly withdrawals or exploring other income sources."}
                  </Text>
                </View>
              </View>
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
    padding: 16,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  calculateButton: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  resetButton: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    flex: 0.48,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resetButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  resultsContainer: {
    backgroundColor: Platform.select({
      web: "rgba(248, 249, 250, 0.8)",
      default: "#F8F9FA",
    }),
    borderRadius: 16,
    padding: Platform.select({
      web: 32,
      default: 16,
    }),
    marginTop: 8,
    maxWidth: Platform.select({
      web: 1200,
      default: 900,
    }),
    alignSelf: "center",
    width: "100%",
    backdropFilter: Platform.OS === "web" ? "blur(10px)" : undefined,
    boxShadow: Platform.OS === "web" ? "0 4px 6px rgba(0, 0, 0, 0.1)" : undefined,
  },
  summaryContainer: {
    marginTop: 24,
    padding: Platform.select({
      web: 24,
      default: 16,
    }),
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 16,
  },
  metricItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  sustainabilityCard: {
    marginTop: 24,
    backgroundColor: "#F8F9FA",
    padding: 16,
    borderRadius: 12,
  },
  sustainabilityTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  healthMetrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  healthItem: {
    flex: 1,
  },
  healthLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  healthValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  recommendationBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#666",
  },
});
