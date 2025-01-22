import { useState, useEffect } from "react";
import { StyleSheet, ScrollView, View, Animated, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import { ThemedView } from "../ThemedView";
import { InputField } from "./InputField";
import { calculateSIP } from "@/utils/calculations";
import { ResultsChart } from "./ResultsChart";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { saveCalculationHistory } from "@/utils/history";
import { YearlyBreakdown } from "./YearlyBreakdown";

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

  const width = useWindowDimensions().width;

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

  const calculateResults = async () => {
    if (!validateInputs()) return;

    const { yearlyBalances, nominalYearlyBalances, years } = calculateSIP({
      monthlyInvestment: parseFloat(monthlyInvestment),
      returnRate: parseFloat(returnRate),
      duration: parseInt(duration),
      inflationRate: parseFloat(inflationRate),
    });

    const totalInvestment = parseInt(duration) * 12 * parseFloat(monthlyInvestment);
    const expectedReturns = results.data[results.data.length - 1] - totalInvestment;
    const totalValue = results.data[results.data.length - 1];

    await saveCalculationHistory({
      type: "SIP",
      params: {
        monthlyInvestment: parseFloat(monthlyInvestment),
        returnRate: parseFloat(returnRate),
        duration: parseInt(duration),
        inflationRate: parseFloat(inflationRate),
      },
      results: {
        totalInvestment,
        expectedReturns,
        totalValue,
      },
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
              <Text style={styles.summaryText}>Total Investment: ₹{(parseInt(duration) * 12 * parseFloat(monthlyInvestment)).toLocaleString()}</Text>

              <Text style={[styles.summarySubtitle, { marginTop: 12 }]}>Without Inflation Adjustment</Text>
              <Text style={styles.summaryText}>
                Expected Returns: ₹
                {(results.nominalData[results.nominalData.length - 1] - parseInt(duration) * 12 * parseFloat(monthlyInvestment)).toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>Total Value: ₹{results.nominalData[results.nominalData.length - 1].toLocaleString()}</Text>

              <Text style={[styles.summarySubtitle, { marginTop: 12 }]}>With Inflation Adjustment</Text>
              <Text style={styles.summaryText}>
                Expected Returns: ₹
                {(results.data[results.data.length - 1] - parseInt(duration) * 12 * parseFloat(monthlyInvestment)).toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>Total Value: ₹{results.data[results.data.length - 1].toLocaleString()}</Text>
            </View>

            <View style={[styles.card, styles.phaseContainer]}>
              <Text style={styles.cardTitle}>Investment Phases</Text>

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

            <View style={[styles.card, styles.insightContainer]}>
              <Text style={styles.cardTitle}>Key Insights</Text>
              <Text style={styles.insightText}>• Monthly Investment: ₹{parseFloat(monthlyInvestment).toLocaleString()}</Text>
              <Text style={styles.insightText}>
                • Wealth Multiplier: {(results.data[results.data.length - 1] / (parseInt(duration) * 12 * parseFloat(monthlyInvestment))).toFixed(2)}x
              </Text>
              <Text style={styles.insightText}>
                • Real Returns (Inflation Adjusted):{" "}
                {((results.data[results.data.length - 1] / (parseInt(duration) * 12 * parseFloat(monthlyInvestment)) - 1) * 100).toFixed(1)}%
              </Text>
            </View>

            <YearlyBreakdown
              type="SIP"
              data={results.data.map((balance, index) => ({
                year: `Year ${index + 1}`,
                investment: parseFloat(monthlyInvestment) * 12,
                balance: balance,
                returns: balance - parseFloat(monthlyInvestment) * 12 * (index + 1),
              }))}
              isSmallScreen={width < 375}
            />
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
      default: 20,
    }),
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
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },
  resetButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
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
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
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
    fontSize: 14,
    color: "#4a4a4a",
    marginBottom: 6,
  },
  summarySubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2a2a2a",
    marginBottom: 6,
    marginTop: 12,
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
    marginBottom: 6,
    paddingVertical: 4,
  },
  phaseLabel: {
    fontSize: 13,
    color: "#4a4a4a",
  },
  phaseValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2a2a2a",
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
    fontSize: 13,
    color: "#4a4a4a",
    marginBottom: 6,
    lineHeight: 18,
  },
});
