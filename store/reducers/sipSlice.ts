import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface YearlyBreakdown {
	year: number;
	investment: number;
	interest: number;
	balance: number;
}

interface SIPState {
	monthlyInvestment: number;
	expectedReturn: number;
	timePeriod: number;
	yearlyBreakdown: YearlyBreakdown[];
}

const initialState: SIPState = {
	monthlyInvestment: 0,
	expectedReturn: 0,
	timePeriod: 0,
	yearlyBreakdown: [],
};

const sipSlice = createSlice({
	name: "sip",
	initialState,
	reducers: {
		setSIPDetails: (
			state,
			action: PayloadAction<{
				monthlyInvestment: number;
				expectedReturn: number;
				timePeriod: number;
			}>
		) => {
			state.monthlyInvestment = action.payload.monthlyInvestment;
			state.expectedReturn = action.payload.expectedReturn;
			state.timePeriod = action.payload.timePeriod;
		},
		setYearlyBreakdown: (state, action: PayloadAction<YearlyBreakdown[]>) => {
			state.yearlyBreakdown = action.payload;
		},
	},
});

export const { setSIPDetails, setYearlyBreakdown } = sipSlice.actions;
export default sipSlice.reducer; 