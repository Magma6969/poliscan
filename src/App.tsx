import React from 'react';
import { ChakraProvider, ColorModeScript, Box, CSSReset } from '@chakra-ui/react';
import { Routes, Route } from 'react-router-dom';
import theme from './styles/theme';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <CSSReset />
      <Box minH="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box as="main" flex="1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Box>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
