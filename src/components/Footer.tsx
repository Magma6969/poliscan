import React from 'react';
import { Box, Text, Flex, Link, HStack, VStack, Icon, useColorModeValue, IconProps } from '@chakra-ui/react';
import { FaInstagram } from 'react-icons/fa';

// Create a properly typed Instagram icon component
const InstagramIcon = (props: IconProps) => <Icon as={FaInstagram as any} {...props} />;

const Footer = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const hoverColor = useColorModeValue('brand.500', 'brand.300');

  return (
    <Box
      as="footer"
      w="100%"
      bg={bg}
      borderTop="1px"
      borderColor={borderColor}
      py={6}
      mt={12}
    >
      <Box maxW="7xl" mx="auto" px={{ base: 4, md: 6 }}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align="center"
        >
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Text fontSize="sm" color={textColor} mb={1}>
              &copy; {new Date().getFullYear()} PoliScan. All rights reserved.
            </Text>
            <Text fontSize="xs" color={textColor} opacity={0.8}>
              Making privacy policies transparent and understandable
            </Text>
          </Box>
          <Box textAlign={{ base: 'center', md: 'right' }} mt={{ base: 4, md: 0 }}>
            <VStack spacing={1} align={{ base: 'center', md: 'flex-end' }}>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                Contact Us
              </Text>
              <Link 
                href="https://instagram.com/poli_scan"
                target="_blank"
                rel="noopener noreferrer"
                isExternal
                fontSize="sm" 
                color={hoverColor}
                _hover={{ textDecoration: 'none', opacity: 0.8 }}
                display="inline-flex"
                alignItems="center"
              >
                <InstagramIcon mr={2} />
                @Poli_scan
              </Link>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
};

export default Footer;
