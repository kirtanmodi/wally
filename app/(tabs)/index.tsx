import { useState } from "react";
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";
import { SIPResultCard } from "@/components/SIPResultCard";
import { CustomInput } from "@/components/CustomInput";

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

  const calculateSIP = () => {
    try {
      setIsCalculating(true);
      const P = parseFloat(monthlyInvestment);
      const r = parseFloat(expectedReturn) / (12 * 100); // Monthly rate
      const t = parseFloat(timePeriod) * 12; // Total months

      const maturityValue = P * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
      const totalInvestment = P * t;
      const totalReturns = maturityValue - totalInvestment;
      const annualizedReturn = ((maturityValue / totalInvestment) ** (1 / parseFloat(timePeriod)) - 1) * 100;

      setCalculation({
        totalInvestment,
        totalReturns,
        maturityValue,
        annualizedReturn,
      });
    } catch (error) {
      console.error("Calculation error:", error);
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
