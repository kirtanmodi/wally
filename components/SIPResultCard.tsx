import { View, Text, StyleSheet } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { MaterialIcons } from "@expo/vector-icons";

interface SIPResultCardProps {
  calculation: {
    totalInvestment: number;
    totalReturns: number;
    maturityValue: number;
    annualizedReturn: number;
  };
}

export const SIPResultCard = ({ calculation }: SIPResultCardProps) => {
  const styles = useGlobalStyles();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <View style={[styles.card, localStyles.resultCard]}>
      <Text style={[styles.titleText, localStyles.resultTitle]}>Investment Summary</Text>

      <ResultRow icon="account-balance-wallet" label="Total Investment" value={formatCurrency(calculation.totalInvestment)} />

      <ResultRow icon="trending-up" label="Total Returns" value={formatCurrency(calculation.totalReturns)} />

      <ResultRow icon="account-balance" label="Maturity Value" value={formatCurrency(calculation.maturityValue)} />

      <ResultRow icon="show-chart" label="Annualized Return" value={`${calculation.annualizedReturn.toFixed(2)}%`} />
    </View>
  );
};

const ResultRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => {
  const styles = useGlobalStyles();

  return (
    <View style={[styles.row, localStyles.resultRow]}>
      <View style={styles.row}>
        <MaterialIcons name={icon as keyof typeof MaterialIcons.glyphMap} size={24} color="#60A5FA" />
        <Text style={[styles.bodyText, localStyles.label]}>{label}</Text>
      </View>
      <Text style={[styles.bodyText, localStyles.value]}>{value}</Text>
    </View>
  );
};

const localStyles = StyleSheet.create({
  resultCard: {
    marginTop: 24,
  },
  resultTitle: {
    textAlign: "center",
    marginBottom: 20,
  },
  resultRow: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    marginLeft: 12,
  },
  value: {
    fontWeight: "600",
  },
});
