import { useTheme } from '@rneui/themed';

export const useColorScheme = () => {
	const { theme } = useTheme();

	return {
		isDarkMode: theme.mode === 'dark',
		isLightMode: theme.mode === 'light',
		currentMode: theme.mode,
	};
}; 