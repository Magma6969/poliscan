import React, { useState, useCallback } from 'react';
// Import types from shared types file
import { AnalysisResult, DataCollectionItem } from '../types/analysis';
// Icons from react-icons/fa
import { 
  FaShieldAlt as FaShieldAltSolid,
  FaLink as FaLinkSolid,
  FaFileAlt as FaFileAltSolid,
  FaSearch as FaSearchSolid,
  FaCheckCircle as FaCheckCircleSolid,
  FaUpload as FaUploadSolid,
  FaDownload as FaDownloadSolid,
  FaArrowRight as FaArrowRightSolid,
  FaLock as FaLockSolid,
  FaEye as FaEyeSolid,
  FaChartPie as FaChartPieSolid,
  FaExclamation,
  FaInfoCircle,
  FaRegLightbulb,
  FaRegClock,
  FaRegCheckCircle,
  FaRegTimesCircle
} from 'react-icons/fa';
import { 
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Icon,
  useColorModeValue,
  useToast,
  SimpleGrid,
  Button,
  HStack,
  useColorMode,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Spinner,
  Link,
  Divider,
  Tooltip,
  Badge,
  Progress,
  List,
  ListItem,
  ListIcon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  FormHelperText,
  FormErrorMessage,
  Select,
  Textarea,
  Image,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Kbd,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  Checkbox,
  Radio,
  RadioGroup,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
  Table,
  TableCaption,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tag,
  TagLabel,
  TagLeftIcon,
  TagRightIcon,
  TagCloseButton,
  AspectRatio,
  useBreakpointValue,
  Icon as ChakraIcon,
  IconProps as ChakraIconProps,
  CircularProgress,
  CircularProgressLabel
} from '@chakra-ui/react';


// Hooks
import usePolicyAnalysis from '../hooks/usePolicyAnalysis';

// Components
import FileUpload from '../components/FileUpload';
import UrlInput from '../components/UrlInput';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define proper types for icons
type IconProps = ChakraIconProps & {
  as?: React.ElementType<any>;
};

// Animation keyframes
const animations = {
  float: {
    '0%': { transform: 'translate(0, 0px) rotate(0deg)' },
    '50%': { transform: 'translate(0, 20px) rotate(5deg)' },
    '100%': { transform: 'translate(0, 0px) rotate(0deg)' },
  },
  pulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
    '100%': { transform: 'scale(1)' },
  },
};

// Decorative blob component
const Blob = (props: any) => {
  const opacity = useColorModeValue(0.2, 0.15);
  const color = useColorModeValue('brand.400', 'brand.200');
  
  return (
    <Box
      position="absolute"
      filter="blur(40px)"
      opacity={opacity}
      zIndex="-1"
      sx={{
        animation: 'float 15s ease-in-out infinite',
        '@keyframes float': animations.float,
      }}
      transformOrigin="center"
      {...props}
    >
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path
          fill={color}
          d="M45.9,-46.5C58.8,-30.6,68,-15.3,69.5,1.1C70.9,17.5,64.5,35,51.7,49.8C38.8,64.6,19.4,76.7,2.7,73.9C-14,71.1,-28,53.5,-41.2,38.7C-54.4,23.9,-66.7,12,-69.9,-2.4C-73.1,-16.7,-67.1,-33.5,-53.9,-49.3C-40.7,-65.1,-20.4,-80.1,-2.3,-77.8C15.8,-75.6,31.6,-56.2,45.9,-46.5Z"
          transform="translate(100 100)"
        />
      </svg>
    </Box>
  );
};

// Hero section content
const heroContent = {
  title: "Demystify Privacy Policies with Ease",
  subtitle: "Harness the power of AI to analyze privacy policies with unparalleled precision and clarity.",
};

// Feature item type
interface FeatureItem {
  title: string;
  description: string;
  icon: React.ElementType<IconProps>;
}

// Import types from shared types file
// Create typed icon components with proper typing
const LinkIcon = (props: IconProps) => <ChakraIcon as={FaLinkSolid as React.ComponentType} {...props} />;
const FileIcon = (props: IconProps) => <ChakraIcon as={FaFileAltSolid as React.ComponentType} {...props} />;
const ArrowRightIcon = (props: IconProps) => <ChakraIcon as={FaArrowRightSolid as React.ComponentType} {...props} />;

const HomePage = () => {
  const [activeInput, setActiveInput] = useState<'url' | 'file'>('url');
  const { 
    isAnalyzing, 
    analysisResult, 
    error: analysisError, 
    analyzeUrl, 
    analyzeFile, 
    reset: resetAnalysis 
  } = usePolicyAnalysis();
  
  const toast = useToast();
  const { colorMode } = useColorMode();
  
  // Theme colors - all useColorModeValue calls must be at the top level
  const bgGradient = useColorModeValue(
    'linear(to-r, purple.600, purple.800)',
    'linear(to-r, purple.700, purple.900)'
  );
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const textMuted = useColorModeValue('gray.500', 'gray.400');
  const iconColor = useColorModeValue('purple.500', 'purple.300');
  const textColor = useColorModeValue('gray.700', 'gray.200');
  
  // Color mode values for UI elements
  const urlBgActive = useColorModeValue('brand.50', 'gray.700');
  const urlBgInactive = useColorModeValue('white', 'gray.800');
  const fileBgActive = useColorModeValue('brand.50', 'gray.700');
  const fileBgInactive = useColorModeValue('white', 'gray.800');
  const borderColorInactive = useColorModeValue('gray.100', 'gray.600');
  const iconBg = useColorModeValue('purple.50', 'purple.900');
  const iconColorValue = useColorModeValue('purple.500', 'purple.300');

  // Handle URL submission
  const handleUrlSubmit = useCallback(async (url: string) => {
    try {
      toast({
        title: 'Analysis started',
        description: 'Analyzing privacy policy from URL...',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      
      await analyzeUrl(url);
      
      toast({
        title: 'Analysis complete',
        description: 'Successfully analyzed privacy policy',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error analyzing URL:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze privacy policy from URL',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [analyzeUrl, toast]);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    try {
      toast({
        title: 'Analysis started',
        description: 'Extracting text from PDF...',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
      
      // Use the analyzeFile function from the hook
      await analyzeFile(file);
      
      toast({
        title: 'Analysis complete',
        description: 'Successfully analyzed privacy policy',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error analyzing file:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to analyze PDF file',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [analyzeFile, toast]);

  // Handle analyze action - now using the analyzeFile or analyzeUrl from usePolicyAnalysis
  const handleAnalyze = useCallback(async (input: string | File) => {
    try {
      if (input instanceof File) {
        await handleFileUpload(input);
      } else {
        await handleUrlSubmit(input);
      }
    } catch (error) {
      console.error('Error during analysis:', error);
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'An error occurred while analyzing the content. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  }, [handleFileUpload, handleUrlSubmit, toast]);

  // Features list
  const features = [
    {
      title: 'Quick Analysis',
      description: 'Get instant insights into privacy policies in seconds.',
      icon: FaSearchSolid,
    },
    {
      title: 'Data Collection',
      description: 'See exactly what data is being collected and why.',
      icon: FaChartPieSolid,
    },
    {
      title: 'Third-Party Sharing',
      description: 'Discover who else has access to your data.',
      icon: FaShieldAltSolid,
    },
  ];

  // Render risk score indicator
  const renderRiskScore = (score: number) => {
    const getColor = (score: number) => {
      if (score >= 75) return 'red.500';
      if (score >= 50) return 'orange.500';
      if (score >= 25) return 'yellow.500';
      return 'green.500';
    };

    return (
      <VStack spacing={4} align="center" p={6} bg={cardBg} borderRadius="lg" boxShadow="md">
        <CircularProgress
          value={score}
          color={getColor(score)}
          size="120px"
          thickness="8px"
        >
          <CircularProgressLabel>
            <VStack spacing={0}>
              <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                {score.toFixed(0)}
              </Text>
              <Text fontSize="sm" color={textMuted}>
                Risk Score
              </Text>
            </VStack>
          </CircularProgressLabel>
        </CircularProgress>
      </VStack>
    );
  };

  // Render data collection items
  const renderDataCollection = (items: DataCollectionItem[]) => {
    return (
      <VStack spacing={4} align="stretch">
        <Heading size="md" color={headingColor} mb={4}>
          Data Collection
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
          {items.map((item, index) => (
            <Card key={index} bg={cardBg} border="1px" borderColor={cardBorder}>
              <CardHeader pb={2}>
                <HStack>
                  <Box
                    w="12px"
                    h="12px"
                    borderRadius="full"
                    bg={
                      item.risk === 'high' 
                        ? 'red.400' 
                        : item.risk === 'medium' 
                        ? 'yellow.400' 
                        : 'green.400'
                    }
                  />
                  <Text fontWeight="semibold">{item.type}</Text>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                <Text fontSize="sm" color={textMuted}>
                  {item.purpose}
                </Text>
                {item.explanation && (
                  <Text fontSize="xs" mt={2} color={textMuted}>
                    {item.explanation}
                  </Text>
                )}
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </VStack>
    );
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" bgGradient={bgGradient}>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          }
        `}
      </style>
      {/* Main content */}
      <Box as="main" flex={1} position="relative" zIndex={1} pt={16}>
        {/* Hero section */}
        <Box py={20} position="relative" overflow="hidden">
          <Container maxW="container.xl" position="relative" zIndex={1}>
            <VStack spacing={8} textAlign="center" maxW="4xl" mx="auto" px={4}>
              <Heading as="h1" size="3xl" fontWeight="bold" bgGradient="linear(to-r, purple.400, pink.400)" bgClip="text">
                {heroContent.title}
              </Heading>
              <Text fontSize="xl" color={textMuted} maxW="2xl" mx="auto">
                {heroContent.subtitle}
              </Text>
              
              {/* Input section */}
              <Box w="100%" maxW="2xl" mx="auto" mt={8}>
                <VStack spacing={6}>
                  {/* URL input */}
                  <Box 
                    w="100%" 
                    p={5} 
                    borderRadius="lg"
                    bg={activeInput === 'url' ? urlBgActive : urlBgInactive}
                    border="1px"
                    borderColor={activeInput === 'url' ? 'brand.200' : borderColorInactive}
                    transition="all 0.2s ease-out"
                    _hover={{
                      borderColor: 'brand.200',
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    onClick={() => setActiveInput('url')}
                    cursor="pointer"
                  >
                    <VStack align="stretch" spacing={4}>
                      <HStack spacing={4}>
                        <Box p={2} bg={iconBg} borderRadius="md">
                          <LinkIcon color={iconColorValue} boxSize={5} />
                        </Box>
                        <Box textAlign="left">
                          <Text fontWeight="semibold" color={headingColor}>Paste a URL</Text>
                          <Text fontSize="sm" color={textMuted}>
                            Analyze a privacy policy from any website
                          </Text>
                        </Box>
                      </HStack>
                      {activeInput === 'url' && (
                        <Box pt={2}>
                          <UrlInput 
                            onUrlSubmit={handleUrlSubmit} 
                            isLoading={isAnalyzing && activeInput === 'url'}
                          />
                        </Box>
                      )}
                    </VStack>
                  </Box>

                  <Text color="gray.400" fontSize="sm" fontWeight="medium">OR</Text>

                  {/* File upload */}
                  <Box 
                    w="100%" 
                    p={5} 
                    borderRadius="lg"
                    bg={activeInput === 'file' ? fileBgActive : fileBgInactive}
                    border="1px"
                    borderColor={activeInput === 'file' ? 'brand.200' : borderColorInactive}
                    transition="all 0.2s ease-out"
                    _hover={{
                      borderColor: 'brand.200',
                      transform: 'translateY(-2px)',
                      boxShadow: 'md',
                    }}
                    onClick={() => setActiveInput('file')}
                    cursor="pointer"
                  >
                    <VStack align="stretch" spacing={4}>
                      <HStack spacing={4}>
                        <Box p={2} bg={iconBg} borderRadius="md">
                          <FileIcon color={iconColorValue} boxSize={5} />
                        </Box>
                        <Box textAlign="left">
                          <Text fontWeight="semibold" color={headingColor}>Upload a PDF</Text>
                          <Text fontSize="sm" color={textMuted}>
                            Upload a privacy policy document (PDF)
                          </Text>
                        </Box>
                      </HStack>
                      {activeInput === 'file' && (
                        <Box pt={2}>
                          <FileUpload 
                            onFileSelect={handleFileUpload} 
                            isLoading={isAnalyzing && activeInput === 'file'}
                          />
                        </Box>
                      )}
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* How it works section */}
        <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
          <Container maxW="7xl">
            <VStack spacing={16}>
              <Box textAlign="center">
                <Text 
                  fontSize="sm" 
                  fontWeight="semibold" 
                  color="purple.500" 
                  textTransform="uppercase" 
                  letterSpacing="wide"
                  mb={3}
                >
                  HOW IT WORKS
                </Text>
                <Heading as="h2" size="2xl" fontWeight="bold" mb={4} color={headingColor}>
                  Simple Steps to Get Started
                </Heading>
                <Text maxW="2xl" mx="auto" color={textMuted}>
                  Follow these easy steps to analyze any privacy policy in seconds
                </Text>
              </Box>

              <SimpleGrid 
                columns={{ base: 1, md: 3 }} 
                spacing={{ base: 6, md: 8 }} 
                w="100%"
                maxW="7xl"
                mx="auto"
              >
                {/* Step 1 */}
                <Box 
                  p={6} 
                  bg={cardBg} 
                  borderRadius="lg" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                  }}
                >
                  <VStack spacing={4} align="center" textAlign="center">
                    <Box 
                      w={16} 
                      h={16} 
                      borderRadius="full" 
                      bg="purple.50" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      color="purple.500"
                      fontSize="2xl"
                      fontWeight="bold"
                      mb={4}
                    >
                      1
                    </Box>
                    <Heading as="h3" size="lg" mb={4} color={headingColor}>
                      Upload or Paste URL
                    </Heading>
                    <Text color={textMuted}>
                      Simply paste the URL of any privacy policy or upload a PDF document directly to our platform.
                    </Text>
                  </VStack>
                </Box>

                {/* Step 2 */}
                <Box 
                  p={6} 
                  bg={cardBg} 
                  borderRadius="lg" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                  }}
                >
                  <VStack spacing={4} align="center" textAlign="center">
                    <Box 
                      w={16} 
                      h={16} 
                      borderRadius="full" 
                      bg="purple.50" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      color="purple.500"
                      fontSize="2xl"
                      fontWeight="bold"
                      mb={4}
                    >
                      2
                    </Box>
                    <Heading as="h3" size="lg" mb={4} color={headingColor}>
                      AI Analysis
                    </Heading>
                    <Text color={textMuted}>
                      Our advanced AI scans the document to identify and categorize all data collection practices.
                    </Text>
                  </VStack>
                </Box>

                {/* Step 3 */}
                <Box 
                  p={6} 
                  bg={cardBg} 
                  borderRadius="lg" 
                  boxShadow="sm"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  transition="all 0.2s"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: 'lg',
                  }}
                >
                  <VStack spacing={4} align="center" textAlign="center">
                    <Box 
                      w={16} 
                      h={16} 
                      borderRadius="full" 
                      bg="purple.50" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      color="purple.500"
                      fontSize="2xl"
                      fontWeight="bold"
                      mb={4}
                    >
                      3
                    </Box>
                    <Heading as="h3" size="lg" mb={4} color={headingColor}>
                      Get Instant Results
                    </Heading>
                    <Text color={textMuted}>
                      Receive a comprehensive report detailing what data is being collected and how it's being used.
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box py={20} bgGradient={bgGradient}>
          <Container maxW="3xl" textAlign="center" px={4}>
            <Box 
              bg={cardBg} 
              p={10} 
              borderRadius="xl" 
              boxShadow="xl"
              borderWidth="1px"
              borderColor={cardBorder}
            >
              <Heading as="h2" size="xl" mb={6} color={headingColor}>
                Ready to analyze a privacy policy?
              </Heading>
              <Text fontSize="lg" color={textMuted} mb={8}>
                Get started today and gain insights into how your data is being used.
              </Text>
              <Button 
                colorScheme="purple" 
                size="lg" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                rightIcon={<ArrowRightIcon />}
              >
                Try It Now
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
