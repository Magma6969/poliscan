import React, { useState } from 'react';
import { Input, InputGroup, InputRightElement, Button, Box, VStack, Text, useColorModeValue, Icon, IconProps } from '@chakra-ui/react';
import { FiGlobe } from 'react-icons/fi';

// Create properly typed icon component with type assertion
const GlobeIcon = (props: IconProps) => <Icon as={FiGlobe as any} {...props} />;

interface UrlInputProps {
  onUrlSubmit: (url: string) => void;
  isLoading?: boolean;
}

const UrlInput: React.FC<UrlInputProps> = ({ onUrlSubmit, isLoading = false }) => {
  const [url, setUrl] = useState('');
  const [isValid, setIsValid] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic URL validation
    const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?$/;
    if (urlPattern.test(url)) {
      setIsValid(true);
      onUrlSubmit(url.startsWith('http') ? url : `https://${url}`);
    } else {
      setIsValid(false);
    }
  };

  return (
    <VStack spacing={4} w="100%" as="form" onSubmit={handleSubmit}>
      {/* URL input field without the descriptive text */}
      <InputGroup size="lg">
        <Input
          type="text"
          placeholder="https://example.com/privacy"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (!isValid) setIsValid(true);
          }}
          isInvalid={!isValid}
          pr="6rem"
          borderColor={useColorModeValue('gray.300', 'gray.600')}
          _hover={{
            borderColor: useColorModeValue('brand.400', 'brand.200'),
          }}
          _focus={{
            borderColor: 'brand.400',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-400)',
          }}
        />
        <InputRightElement width="6rem" mr={1}>
          <Button
            h="2rem"
            size="sm"
            colorScheme="brand"
            type="submit"
            isLoading={isLoading}
            loadingText="Analyzing..."
            leftIcon={<GlobeIcon />}
          >
            Analyze
          </Button>
        </InputRightElement>
      </InputGroup>
      {!isValid && (
        <Text color="red.500" fontSize="sm" alignSelf="flex-start">
          Please enter a valid URL (e.g., example.com or https://example.com)
        </Text>
      )}
    </VStack>
  );
};

export default UrlInput;
