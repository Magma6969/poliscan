import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  HStack,
  Text,
  useColorMode,
  useColorModeValue,
  Switch,
  Tooltip,
  Icon,
  usePrefersReducedMotion,
  chakra,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { FiSun, FiMoon, FiShield } from 'react-icons/fi';
import type { IconType } from 'react-icons';

// Type assertion for the icon props
const ShieldIcon = chakra(FiShield as any);
const MoonIcon = chakra(FiMoon as any);
const SunIcon = chakra(FiSun as any);

// Define keyframes for the animation
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Create a styled component for the animation
// Type assertion for the icon prop
const AnimatedIcon = chakra(Box as any, {
  baseStyle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    w: 5,
    h: 5,
  },
});

interface NavbarProps {}



const Navbar: React.FC<NavbarProps> = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  const animation = prefersReducedMotion
    ? undefined
    : `${spin} 0.5s ease-in-out`;

  // Add subtle background pattern in light mode
  const bgPattern = useColorModeValue(
    'repeating-linear-gradient(45deg, #f5f3ff 0, #f5f3ff 1px, transparent 1px, transparent 11px)',
    'repeating-linear-gradient(45deg, #2d3748 0, #2d3748 1px, transparent 1px, transparent 11px)'
  );

  // Add decorative elements
  const decorativeElement = useColorModeValue(
    'linear-gradient(45deg, #e9d5ff, #c4b5fd, #8b5cf6, #7c3aed)',
    'linear-gradient(45deg, #8b5cf6, #7c3aed, #6d28d9, #5b21b6)'
  );

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const iconColor = useColorModeValue('brand.500', 'brand.300');
  const switchTrackBg = useColorModeValue('gray.200', 'gray.600');
  const switchThumbBg = useColorModeValue('white', 'gray.200');
  const switchActiveBg = useColorModeValue('brand.500', 'brand.300');

  // Ensure component is mounted before rendering to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Move all hooks before any conditional returns
  const hoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  if (!mounted) {
    return null;
  }

  return (
    <Box
      as="nav"
      bg={bg}
      color={textColor}
      boxShadow="sm"
      position="sticky"
      top={0}
      zIndex="sticky"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: bgPattern,
        opacity: 0.05,
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      <Flex
        maxW="7xl"
        mx="auto"
        px={{ base: 4, md: 6 }}
        py={3}
        align="center"
      >
        <HStack spacing={3}>
          <ShieldIcon boxSize={6} color={iconColor} />
          <Text
            fontSize="xl"
            fontWeight="bold"
            bgGradient="linear(to-r, brand.500, brand.300)"
            bgClip="text"
            letterSpacing="tighter"
          >
            PoliScan
          </Text>
        </HStack>
        
        <Box flex={1} />
        
        <HStack spacing={3}>
          <Tooltip 
            label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
            placement="bottom"
            hasArrow
          >
            <HStack spacing={2} align="center">
              <AnimatedIcon animation={animation}>
                {colorMode === 'light' ? (
                  <MoonIcon boxSize={4} color={iconColor} />
                ) : (
                  <SunIcon boxSize={4} color={iconColor} />
                )}
              </AnimatedIcon>
              <Switch
                size="md"
                colorScheme="brand"
                isChecked={colorMode === 'dark'}
                onChange={toggleColorMode}
                aria-label={`Toggle ${colorMode === 'light' ? 'dark' : 'light'} mode`}
                sx={{
                  'span[data-checked]': {
                    '> span': {
                      bg: switchThumbBg,
                    },
                    bg: switchActiveBg,
                  },
                  'span:not([data-checked])': {
                    '> span': {
                      bg: switchThumbBg,
                    },
                    bg: switchTrackBg,
                  }
                }}
              />
            </HStack>
          </Tooltip>
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar;
