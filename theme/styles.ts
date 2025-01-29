import { StyleSheet, Dimensions, Platform } from 'react-native';
import { AppTheme } from './Theme';

const { width, height } = Dimensions.get('window');

// Constants for consistent spacing and sizing
const SPACING = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
};

const BORDER_RADIUS = {
	sm: 8,
	md: 12,
	lg: 16,
	xl: 24,
	circular: 9999,
};

// Error handling for theme validation
const validateTheme = (theme: AppTheme): boolean => {
	const requiredColors = ['primary', 'background', 'disabled'];
	return requiredColors.every(color => theme.colors[color as keyof typeof theme.colors] !== undefined);
};

export const createGlobalStyles = (theme: AppTheme, isDarkMode: boolean) => {
	// Validate theme before creating styles
	if (!validateTheme(theme)) {
		throw new Error('Invalid theme configuration: missing required colors');
	}

	// Dynamic color palette
	const colors = {
		text: {
			primary: isDarkMode ? '#FFFFFF' : '#1A1A1A',
			secondary: isDarkMode ? '#B0B0B0' : '#666666',
			tertiary: isDarkMode ? '#707070' : '#999999',
		},
		surface: {
			primary: isDarkMode ? '#121212' : '#FFFFFF',
			secondary: isDarkMode ? '#1E1E1E' : '#F8F8F8',
			tertiary: isDarkMode ? '#2A2A2A' : '#EEEEEE',
		},
		border: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
	};

	return StyleSheet.create({
		// Layout
		container: {
			flex: 1,
			backgroundColor: colors.surface.primary,
		},
		safeArea: {
			flex: 1,
			backgroundColor: colors.surface.primary,
		},
		centerContent: {
			flex: 1,
			justifyContent: 'center',
			alignItems: 'center',
		},
		row: {
			flexDirection: 'row',
			alignItems: 'center',
		},
		spaceBetween: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
		},

		// Typography
		headerText: {
			fontSize: 32,
			fontWeight: Platform.select({ ios: '700', android: 'bold' }),
			color: colors.text.primary,
			letterSpacing: -0.5,
			marginBottom: SPACING.lg,
		},
		titleText: {
			fontSize: 24,
			fontWeight: Platform.select({ ios: '600', android: 'bold' }),
			color: colors.text.primary,
			letterSpacing: -0.3,
			marginBottom: SPACING.md,
		},
		bodyText: {
			fontSize: 16,
			color: colors.text.secondary,
			lineHeight: 24,
			letterSpacing: 0.15,
		},
		smallText: {
			fontSize: 14,
			color: colors.text.tertiary,
			letterSpacing: 0.1,
		},

		// Cards
		card: {
			backgroundColor: colors.surface.secondary,
			borderRadius: BORDER_RADIUS.lg,
			padding: SPACING.md,
			marginVertical: SPACING.sm,
			...Platform.select({
				ios: {
					shadowColor: isDarkMode ? '#000000' : '#666666',
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.1,
					shadowRadius: 12,
				},
				android: {
					elevation: 4,
				},
			}),
		},
		glassCard: {
			backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.7)',
			backdropFilter: 'blur(10px)',
			borderRadius: BORDER_RADIUS.lg,
			padding: SPACING.md,
			borderWidth: 1,
			borderColor: colors.border,
		},

		// Inputs
		input: {
			height: 56,
			backgroundColor: colors.surface.tertiary,
			borderRadius: BORDER_RADIUS.md,
			paddingHorizontal: SPACING.md,
			color: colors.text.primary,
			fontSize: 16,
			borderWidth: 1,
			borderColor: colors.border,
			...Platform.select({
				ios: {
					shadowColor: isDarkMode ? '#000000' : '#666666',
					shadowOffset: { width: 0, height: 2 },
					shadowOpacity: 0.05,
					shadowRadius: 8,
				},
				android: {
					elevation: 2,
				},
			}),
		},

		// Buttons
		button: {
			backgroundColor: theme.colors.primary,
			paddingVertical: SPACING.md,
			paddingHorizontal: SPACING.xl,
			borderRadius: BORDER_RADIUS.md,
			alignItems: 'center',
			justifyContent: 'center',
			...Platform.select({
				ios: {
					shadowColor: theme.colors.primary,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.3,
					shadowRadius: 8,
				},
				android: {
					elevation: 4,
				},
			}),
		},
		buttonText: {
			color: '#FFFFFF',
			fontSize: 16,
			fontWeight: '600',
			letterSpacing: 0.5,
		},
		buttonDisabled: {
			backgroundColor: theme.colors.disabled,
			opacity: 0.7,
		},
		iconButton: {
			width: 48,
			height: 48,
			borderRadius: BORDER_RADIUS.circular,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.surface.secondary,
		},

		// Spacing
		padding: {
			padding: SPACING.md,
		},
		margin: {
			margin: SPACING.md,
		},
		paddingHorizontal: {
			paddingHorizontal: SPACING.md,
		},
		paddingVertical: {
			paddingVertical: SPACING.md,
		},

		// Divider
		divider: {
			height: 1,
			backgroundColor: colors.border,
			marginVertical: SPACING.md,
		},

		// Modern UI Elements
		pill: {
			paddingHorizontal: SPACING.md,
			paddingVertical: SPACING.xs,
			borderRadius: BORDER_RADIUS.circular,
			backgroundColor: colors.surface.tertiary,
			alignSelf: 'flex-start',
		},
		badge: {
			minWidth: 24,
			height: 24,
			borderRadius: BORDER_RADIUS.circular,
			backgroundColor: theme.colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
			paddingHorizontal: SPACING.xs,
		},
		floatingActionButton: {
			width: 56,
			height: 56,
			borderRadius: BORDER_RADIUS.circular,
			backgroundColor: theme.colors.primary,
			alignItems: 'center',
			justifyContent: 'center',
			position: 'absolute',
			bottom: SPACING.xl,
			right: SPACING.xl,
			...Platform.select({
				ios: {
					shadowColor: theme.colors.primary,
					shadowOffset: { width: 0, height: 4 },
					shadowOpacity: 0.3,
					shadowRadius: 8,
				},
				android: {
					elevation: 8,
				},
			}),
		},
	});
}; 