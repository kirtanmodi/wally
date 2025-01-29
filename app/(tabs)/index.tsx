import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { SIPResultCard } from "@/components/SIPResultCard";
import { CustomInput } from "@/components/CustomInput";
import { useDispatch } from "react-redux";
import { setSIPDetails, setYearlyBreakdown } from "@/store/reducers/sipSlice";

interface SIPCalculation {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  annualizedReturn: number;
}

export default function Index() {
  const styles = useGlobalStyles();
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [calculation, setCalculation] = useState<SIPCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const dispatch = useDispatch();

  interface YearlyBreakdownItem {
    year: number;
    investment: number;
    interest: number;
    balance: number;
  }

  const calculateSIP = async () => {
    try {
      setIsCalculating(true);

      // simulate async calculation
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Input validation
      if (!monthlyInvestment || !expectedReturn || !timePeriod) {
        throw new Error("Please fill in all required fields");
      }

      // Parse and validate numeric inputs
      const monthlyAmount = parseFloat(monthlyInvestment);
      const returnRate = parseFloat(expectedReturn);
      const years = parseFloat(timePeriod);

      // Validate input ranges
      if (isNaN(monthlyAmount) || monthlyAmount <= 0) {
        throw new Error("Monthly investment must be a positive number");
      }
      if (isNaN(returnRate) || returnRate <= 0) {
        throw new Error("Expected return must be a positive number");
      }
      if (isNaN(years) || years <= 0) {
        throw new Error("Time period must be a positive number");
      }

      // Calculate monthly rate and total months
      const monthlyRate = returnRate / (12 * 100);
      const totalMonths = years * 12;

      // Calculate maturity value using SIP formula
      // FV = P * ((1 + r)^t - 1) / r * (1 + r)
      const maturityValue = monthlyAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);

      // Calculate other metrics
      const totalInvestment = monthlyAmount * totalMonths;
      const totalReturns = maturityValue - totalInvestment;
      const annualizedReturn = (Math.pow(maturityValue / totalInvestment, 1 / years) - 1) * 100;

      // Round values for better display
      const roundedCalculation: SIPCalculation = {
        totalInvestment: Math.round(totalInvestment),
        totalReturns: Math.round(totalReturns),
        maturityValue: Math.round(maturityValue),
        annualizedReturn: Math.round(annualizedReturn * 100) / 100,
      };

      setCalculation(roundedCalculation);

      // Calculate yearly breakdown with proper typing
      const yearlyBreakdown: YearlyBreakdownItem[] = [];
      let cumulativeInvestment = 0;
      let previousBalance = 0;

      for (let year = 1; year <= Math.ceil(years); year++) {
        const yearlyInvestment = monthlyAmount * 12;
        cumulativeInvestment += yearlyInvestment;

        // Calculate balance for current year using compound interest formula
        // FV = P(1 + r)^t + PMT * (((1 + r)^t - 1) / r)
        // Where:
        // P = Previous balance
        // r = Annual interest rate
        // t = 1 year
        // PMT = Monthly investment * 12
        const r = returnRate / 100;
        const balance = previousBalance * (1 + r) + yearlyInvestment * (1 + r / 2);

        // Calculate interest earned
        const interest = balance - previousBalance - yearlyInvestment;

        yearlyBreakdown.push({
          year,
          investment: Math.round(yearlyInvestment),
          interest: Math.round(interest),
          balance: Math.round(balance),
        });

        previousBalance = balance;
      }

      // Verify final balance matches maturity value
      const finalYearData = yearlyBreakdown[yearlyBreakdown.length - 1];
      if (Math.abs(finalYearData.balance - roundedCalculation.maturityValue) > 1) {
        // Adjust final year values if there's a discrepancy
        finalYearData.interest += roundedCalculation.maturityValue - finalYearData.balance;
        finalYearData.balance = roundedCalculation.maturityValue;
      }

      // Dispatch actions to update Redux store
      dispatch(
        setSIPDetails({
          monthlyInvestment: monthlyAmount,
          expectedReturn: returnRate,
          timePeriod: years,
        })
      );
      dispatch(setYearlyBreakdown(yearlyBreakdown));
    } catch (error) {
      console.error("SIP Calculation Error:", error instanceof Error ? error.message : "Unknown error");
      setCalculation(null);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.padding}>
      <Text style={styles.headerText}>SIP Calculator</Text>

      <View style={styles.glassCard}>
        <CustomInput
          label="Monthly Investment (₹)"
          value={monthlyInvestment}
          onChangeText={setMonthlyInvestment}
          keyboardType="numeric"
          icon="account-balance-wallet"
        />

        <CustomInput label="Expected Return (%)" value={expectedReturn} onChangeText={setExpectedReturn} keyboardType="numeric" icon="trending-up" />

        <CustomInput label="Time Period (Years)" value={timePeriod} onChangeText={setTimePeriod} keyboardType="numeric" icon="access-time" />

        <TouchableOpacity
          style={[styles.button, !monthlyInvestment && styles.buttonDisabled]}
          onPress={calculateSIP}
          disabled={!monthlyInvestment || !expectedReturn || !timePeriod || isCalculating}
        >
          {isCalculating ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Calculate</Text>}
        </TouchableOpacity>
      </View>

      {calculation && <SIPResultCard calculation={calculation} />}
    </ScrollView>
  );
}
