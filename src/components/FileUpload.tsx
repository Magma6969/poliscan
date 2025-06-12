import React, { useCallback, useState } from 'react';
import { Box, Button, Text, VStack, useColorModeValue, Icon, IconProps } from '@chakra-ui/react';
import { FiUpload, FiFile } from 'react-icons/fi';

// Create properly typed icon components with type assertion
const UploadIcon = (props: IconProps) => <Icon as={FiUpload as any} {...props} />;
const FileIcon = (props: IconProps) => <Icon as={FiFile as any} {...props} />;

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading = false }) => {
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const bgHover = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setFileName(file.name);
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelect(file);
    }
  };

  return (
    <VStack spacing={4} w="100%">
      <Box
        borderWidth="2px"
        borderRadius="lg"
        borderStyle="dashed"
        borderColor={isDragging ? 'brand.400' : borderColor}
        p={8}
        w="100%"
        textAlign="center"
        transition="all 0.2s"
        bg={isDragging ? bgHover : 'transparent'}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragOver}
        onDrop={handleDrop}
        cursor="pointer"
        _hover={{ borderColor: 'brand.400', bg: bgHover }}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf"
          onChange={handleFileInput}
          style={{ display: 'none' }}
        />
        <VStack spacing={3}>
          <UploadIcon w={8} h={8} color="brand.400" />
          <Text fontWeight="medium" color={textColor}>
            Drag and drop your PDF here, or click to select
          </Text>
          <Text fontSize="sm" color="gray.500">
            Only PDF files are supported (max 10MB)
          </Text>
          {fileName && (
            <Box mt={2} display="flex" alignItems="center">
              <FileIcon mr={2} />
              <Text fontSize="sm" isTruncated maxW="300px">
                {fileName}
              </Text>
            </Box>
          )}
          <Button
            mt={4}
            colorScheme="brand"
            onClick={() => document.getElementById('file-upload')?.click()}
            isLoading={isLoading}
            loadingText="Uploading..."
          >
            Select File
          </Button>
        </VStack>
      </Box>
    </VStack>
  );
};

export default FileUpload;
