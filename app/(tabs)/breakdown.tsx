import { View, Text, ScrollView } from "react-native";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { YearlyBreakdownTable } from "@/components/YearlyBreakdownTable";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";

export default function Breakdown() {
  const styles = useGlobalStyles();
  const hasData = useSelector((state: RootState) => state.sip.yearlyBreakdown.length > 0);

  return (
    <ScrollView style={[styles.container]} contentContainerStyle={styles.padding}>
      <Text style={styles.headerText}>Yearly Breakdown</Text>

      {hasData ? (
        <View style={styles.glassCard}>
          <YearlyBreakdownTable />
        </View>
      ) : (
        <View style={[styles.glassCard, styles.centerContent]}>
          <Text style={styles.bodyText}>Calculate SIP first to see the yearly breakdown</Text>
        </View>
      )}
    </ScrollView>
  );
}
