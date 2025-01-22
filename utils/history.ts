import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

export async function saveCalculationHistory(calculation: {
	type: "SIP" | "SWP";
	params: {
		monthlyInvestment?: number;
		returnRate: number;
		duration: number;
		inflationRate?: number;
		initialInvestment?: number;
		monthlyWithdrawal?: number;
	};
	results: {
		totalInvestment?: number;
		expectedReturns?: number;
		totalValue?: number;
		totalWithdrawals?: number;
		finalBalance?: number;
	};
}) {
	try {
		const existingHistory = await AsyncStorage.getItem("calculationHistory");
		const history = existingHistory ? JSON.parse(existingHistory) : [];

		const newCalculation = {
			id: Date.now().toString(),
			type: calculation.type,
			date: new Date().toISOString(),
			params: calculation.params,
			results: calculation.results,
		};

		history.unshift(newCalculation);
		await AsyncStorage.setItem("calculationHistory", JSON.stringify(history));
	} catch (error) {
		Alert.alert("Error", "Failed to save calculation history");
	}
} 