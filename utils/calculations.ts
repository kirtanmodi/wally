interface SIPParams {
	monthlyInvestment: number;
	returnRate: number;
	duration: number;
	inflationRate: number;
}

interface SWPParams {
	initialInvestment: number;
	monthlyWithdrawal: number;
	returnRate: number;
	duration: number;
}

export function calculateSIP({ monthlyInvestment, returnRate, duration, inflationRate }: SIPParams) {
	const monthlyRate = (returnRate / 100) / 12;
	const inflationAdjustedReturn = ((1 + returnRate / 100) / (1 + inflationRate / 100) - 1) * 100;
	const monthlyInflationAdjustedRate = (inflationAdjustedReturn / 100) / 12;

	const yearlyBalances: number[] = [];
	const nominalYearlyBalances: number[] = [];
	const years: string[] = [];

	let balance = 0;
	let realBalance = 0;

	for (let year = 1; year <= duration; year++) {
		for (let month = 1; month <= 12; month++) {
			balance = balance * (1 + monthlyRate) + monthlyInvestment;
			realBalance = realBalance * (1 + monthlyInflationAdjustedRate) + monthlyInvestment;
		}
		nominalYearlyBalances.push(Math.round(balance));
		yearlyBalances.push(Math.round(realBalance));
		years.push(`Year ${year}`);
	}

	return { yearlyBalances, nominalYearlyBalances, years };
}

export function calculateSWP({ initialInvestment, monthlyWithdrawal, returnRate, duration }: SWPParams) {
	const monthlyRate = (returnRate / 100) / 12;
	const yearlyBalances: number[] = [];
	const years: string[] = [];

	let balance = initialInvestment;

	for (let year = 1; year <= duration; year++) {
		for (let month = 1; month <= 12; month++) {
			balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
			if (balance < 0) balance = 0;
		}
		yearlyBalances.push(Math.round(balance));
		years.push(`Year ${year}`);
	}

	return { yearlyBalances, years };
} 