import { useTheme } from '@rneui/themed';
import { useColorScheme } from './useColorScheme';
import { createGlobalStyles } from '@/theme/styles';

export const useGlobalStyles = () => {
	const { theme } = useTheme();
	const { isDarkMode } = useColorScheme();

	return createGlobalStyles(theme, isDarkMode);
}; 