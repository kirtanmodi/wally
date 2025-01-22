import { SafeAreaView, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useState } from "react";
import { Tabs } from "@/components/Tabs";
import { SIPCalculator } from "@/components/calculators/SIPCalculator";
import { SWPCalculator } from "@/components/calculators/SWPCalculator";

export default function CalculatorScreen() {
  const [activeTab, setActiveTab] = useState<"SIP" | "SWP">("SIP");

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.container}>
        <Tabs
          tabs={[
            { id: "SIP", label: "SIP Calculator" },
            { id: "SWP", label: "SWP Calculator" },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as "SIP" | "SWP")}
        />

        {activeTab === "SIP" ? <SIPCalculator /> : <SWPCalculator />}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    marginBottom: 24,
    textAlign: "center",
  },
});
