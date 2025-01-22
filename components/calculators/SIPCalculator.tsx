import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Animated, TouchableOpacity, Platform } from "react-native";
import { ThemedView } from "../ThemedView";
import { InputField } from "./InputField";
import { calculateSIP } from "@/utils/calculations";
import { ResultsChart } from "./ResultsChart";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface ValidationErrors {
  monthlyInvestment?: string;
  returnRate?: string;
  duration?: string;
  inflationRate?: string;
}

export function SIPCalculator() {
  const insets = useSafeAreaInsets();
  const [monthlyInvestment, setMonthlyInvestment] = useState("5000");
  const [returnRate, setReturnRate] = useState("12");
  const [duration, setDuration] = useState("10");
  const [inflationRate, setInflationRate] = useState("6");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showResults, setShowResults] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [results, setResults] = useState<{
    labels: string[];
    data: number[];
    nominalData: number[];
  }>({
    labels: [],
    data: [],
    nominalData: [],
  });

  const validateInputs = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!monthlyInvestment || parseFloat(monthlyInvestment) <= 0) {
      newErrors.monthlyInvestment = "Please enter a valid monthly investment amount";
    }
    if (!returnRate || parseFloat(returnRate) < 0 || parseFloat(returnRate) > 100) {
      newErrors.returnRate = "Return rate should be between 0 and 100";
    }
    if (!duration || parseInt(duration) <= 0 || parseInt(duration) > 50) {
      newErrors.duration = "Duration should be between 1 and 50 years";
    }
    if (!inflationRate || parseFloat(inflationRate) < 0 || parseFloat(inflationRate) > 50) {
      newErrors.inflationRate = "Inflation rate should be between 0 and 50";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateResults = () => {
    if (!validateInputs()) return;

    const { yearlyBalances, nominalYearlyBalances, years } = calculateSIP({
      monthlyInvestment: parseFloat(monthlyInvestment),
      returnRate: parseFloat(returnRate),
      duration: parseInt(duration),
      inflationRate: parseFloat(inflationRate),
    });

    setResults({
      labels: years,
      data: yearlyBalances,
      nominalData: nominalYearlyBalances,
    });

    setShowResults(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const resetCalculator = () => {
    setMonthlyInvestment("5000");
    setReturnRate("12");
    setDuration("10");
    setInflationRate("6");
    setErrors({});
    setShowResults(false);
    fadeAnim.setValue(0);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <ThemedView style={styles.container}>
        <View style={styles.inputContainer}>
          <InputField
            label="Monthly Investment"
            value={monthlyInvestment}
            onChangeText={setMonthlyInvestment}
            placeholder="Enter amount"
            suffix="₹"
            keyboardType="numeric"
            error={errors.monthlyInvestment}
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

          <InputField
            label="Inflation Rate"
            value={inflationRate}
            onChangeText={setInflationRate}
            placeholder="Enter percentage"
            suffix="%"
            keyboardType="numeric"
            error={errors.inflationRate}
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
            {/* <ResultsChart data={results.data} labels={results.labels} title="Investment Growth" /> */}
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Summary</Text>
              <Text style={styles.summaryText}>Total Investment: ₹{(parseInt(duration) * 12 * parseFloat(monthlyInvestment)).toLocaleString()}</Text>

              <Text style={[styles.summarySubtitle, { marginTop: 16 }]}>Without Inflation Adjustment</Text>
              <Text style={styles.summaryText}>
                Expected Returns: ₹
                {(results.nominalData[results.nominalData.length - 1] - parseInt(duration) * 12 * parseFloat(monthlyInvestment)).toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>Total Value: ₹{results.nominalData[results.nominalData.length - 1].toLocaleString()}</Text>

              <Text style={[styles.summarySubtitle, { marginTop: 16 }]}>With Inflation Adjustment</Text>
              <Text style={styles.summaryText}>
                Expected Returns: ₹
                {(results.data[results.data.length - 1] - parseInt(duration) * 12 * parseFloat(monthlyInvestment)).toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>Total Value: ₹{results.data[results.data.length - 1].toLocaleString()}</Text>
            </View>

            <View style={styles.phaseContainer}>
              <Text style={styles.phaseTitle}>Investment Phases</Text>

              <View style={styles.phaseItem}>
                <Text style={styles.phaseLabel}>Short Term (1-3 years)</Text>
                <Text style={styles.phaseValue}>₹{results.data[Math.min(2, results.data.length - 1)].toLocaleString()}</Text>
              </View>

              <View style={styles.phaseItem}>
                <Text style={styles.phaseLabel}>Medium Term (5 years)</Text>
                <Text style={styles.phaseValue}>₹{results.data[Math.min(4, results.data.length - 1)].toLocaleString()}</Text>
              </View>

              <View style={styles.phaseItem}>
                <Text style={styles.phaseLabel}>Long Term (10 years)</Text>
                <Text style={styles.phaseValue}>₹{results.data[Math.min(9, results.data.length - 1)].toLocaleString()}</Text>
              </View>
            </View>

            <View style={styles.insightContainer}>
              <Text style={styles.insightTitle}>Key Insights</Text>
              <Text style={styles.insightText}>• Monthly Investment: ₹{parseFloat(monthlyInvestment).toLocaleString()}</Text>
              <Text style={styles.insightText}>
                • Wealth Multiplier: {(results.data[results.data.length - 1] / (parseInt(duration) * 12 * parseFloat(monthlyInvestment))).toFixed(2)}x
              </Text>
              <Text style={styles.insightText}>
                • Real Returns (Inflation Adjusted):{" "}
                {((results.data[results.data.length - 1] / (parseInt(duration) * 12 * parseFloat(monthlyInvestment)) - 1) * 100).toFixed(1)}%
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
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
  summaryText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  phaseContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  phaseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },
  phaseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  phaseLabel: {
    fontSize: 14,
    color: "#666",
  },
  phaseValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  insightContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 2,
  },
  insightTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#444",
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});
