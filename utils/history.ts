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
		yearlyData: {
			year: number;
			investment?: number;
			withdrawal?: number;
			balance: number;
			returns?: number;
		}[];
	};
}) {
	try {
		const newCalculation = {
			id: Date.now().toString(),
			type: calculation.type,
			date: new Date().toISOString(),
			params: calculation.params,
			results: calculation.results,
		};

		await AsyncStorage.setItem("calculationHistory", JSON.stringify(newCalculation));
	} catch (error) {
		Alert.alert("Error", "Failed to save calculation");
	}
} 