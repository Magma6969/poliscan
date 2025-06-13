import React from 'react';
import { ChakraProvider, ColorModeScript, Box, CSSReset, Container, Heading, Button } from '@chakra-ui/react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import theme from './styles/theme';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Error Boundary component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container centerContent mt={10}>
          <Heading mb={4}>Something went wrong</Heading>
          <Button colorScheme="purple" onClick={() => window.location.href = '/poliscan/'}>
            Go to Home
          </Button>
        </Container>
      );
    }

    return this.props.children;
  }
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CSSReset />
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box as="main" flex="1">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element={
                <Container centerContent mt={10}>
                  <Heading mb={4}>404 - Page Not Found</Heading>
                  <Button as="a" href="/poliscan/" colorScheme="purple">
                    Go to Home
                  </Button>
                </Container>
              } />
            </Routes>
          </ErrorBoundary>
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
