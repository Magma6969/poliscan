import React from 'react';
import { Box } from '@chakra-ui/react';

const spin = {
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
  animation: 'spin 0.8s linear infinite',
};

interface LoadingSpinnerProps {
  size?: string;
  color?: string;
  thickness?: string;
  emptyColor?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = '24px',
  color = 'brand.500',
  thickness = '4px',
  emptyColor = 'transparent',
}) => {
  return (
    <Box
      display="inline-block"
      width={size}
      height={size}
      borderWidth={thickness}
      borderColor={emptyColor}
      borderTopColor={color}
      borderRightColor={color}
      borderBottomColor={color}
      borderRadius="50%"
      animation={spin.animation}
      sx={spin}
      position="relative"
    >
      <Box
        position="absolute"
        top="-2px"
        left="-2px"
        right="-2px"
        bottom="-2px"
        borderRadius="50%"
        border="2px solid"
        borderColor={emptyColor}
        borderTopColor={color}
        borderRightColor={emptyColor}
        borderBottomColor={emptyColor}
        opacity="0.7"
      />
    </Box>
  );
};

export default LoadingSpinner;
