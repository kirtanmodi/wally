import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/store/reducers";
import { useGlobalStyles } from "@/hooks/useGlobalStyles";
import { useColorScheme } from "@/hooks/useColorScheme";

export const YearlyBreakdownTable = () => {
  const styles = useGlobalStyles();
  const { isDarkMode } = useColorScheme();
  const yearlyBreakdown = useSelector((state: RootState) => state.sip.yearlyBreakdown);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View>
        <View style={[localStyles.headerRow, { backgroundColor: isDarkMode ? "#1F2937" : "#F3F4F6" }]}>
          <Text style={[localStyles.headerCell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>Year</Text>
          <Text style={[localStyles.headerCell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>Investment</Text>
          <Text style={[localStyles.headerCell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>Interest</Text>
          <Text style={[localStyles.headerCell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>Balance</Text>
        </View>
        <ScrollView>
          {yearlyBreakdown.map((item, index) => (
            <View
              key={item.year}
              style={[
                localStyles.row,
                { backgroundColor: isDarkMode ? "#374151" : "#FFFFFF" },
                index % 2 === 0 && { backgroundColor: isDarkMode ? "#4B5563" : "#F9FAFB" },
              ]}
            >
              <Text style={[localStyles.cell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>{item.year}</Text>
              <Text style={[localStyles.cell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>{formatCurrency(item.investment)}</Text>
              <Text style={[localStyles.cell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>{formatCurrency(item.interest)}</Text>
              <Text style={[localStyles.cell, { color: isDarkMode ? "#E5E7EB" : "#1F2937" }]}>{formatCurrency(item.balance)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerCell: {
    width: 120,
    fontWeight: "bold",
    paddingHorizontal: 12,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  cell: {
    width: 120,
    paddingHorizontal: 12,
  },
});
