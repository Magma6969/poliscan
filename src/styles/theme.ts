import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Define color mode config
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
  cssVarPrefix: 'poliscan',
};

// Define brand colors
const colors = {
  brand: {
    50: '#f0f4ff',
    100: '#dbe8ff',
    200: '#a5c4ff',
    300: '#7ba6ff',
    400: '#4d7cff',
    500: '#6366f1',  // Updated purple shade for better contrast
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#1e1b4b',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#0f172a',  // Darker for better contrast in dark mode
  },
};



// Define button styles
const Button = {
  baseStyle: {
    fontWeight: 'semibold',
    borderRadius: 'lg',
    _focus: {
      boxShadow: '0 0 0 3px rgba(59, 91, 219, 0.4)',
    },
  },
  variants: {
    solid: (props: any) => ({
      bg: 'brand.500',
      color: 'white',
      _hover: {
        bg: 'brand.600',
        transform: 'translateY(-1px)',
        boxShadow: 'md',
        _disabled: {
          bg: 'brand.500',
          transform: 'none',
        },
      },
      _active: {
        bg: 'brand.700',
        transform: 'translateY(0)',
      },
      _disabled: {
        bg: 'brand.300',
        cursor: 'not-allowed',
        opacity: 0.7,
      },
    }),
    outline: (props: any) => ({
      border: '1px solid',
      borderColor: 'brand.500',
      color: 'brand.500',
      _hover: {
        bg: 'brand.50',
        _dark: {
          bg: 'whiteAlpha.100',
        },
      },
    }),
    ghost: (props: any) => ({
      color: 'brand.500',
      _hover: {
        bg: 'brand.50',
        _dark: {
          bg: 'whiteAlpha.100',
        },
      },
    }),
  },
  defaultProps: {
    variant: 'solid',
  },
};

// Extend the theme
const theme = extendTheme({
  config,
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        transition: 'background-color 0.2s, color 0.2s',
      },
      '::selection': {
        bg: 'brand.500',
        color: 'white',
      },
    }),
  },
  colors,
  shadows: {
    outline: '0 0 0 3px var(--poliscan-colors-brand-400)',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  components: {
    Button,
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
          boxShadow: 'sm',
          _hover: {
            boxShadow: 'md',
            transform: 'translateY(-2px)',
          },
          transition: 'all 0.2s',
        },
      }),
    },
  },
});

export default theme;
