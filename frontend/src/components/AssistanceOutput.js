import React from 'react';
import { 
  Box, 
  Heading, 
  useColorModeValue 
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

function AssistanceOutput({ response }) {
  const borderColor = useColorModeValue('rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.3)');
  const bgGradient = useColorModeValue('linear(to-r, #f8fafc, #f1f5f9)', 'linear(to-r, gray.700, gray.800)');

  return (
    <Box 
      className="assistance-output"
      borderRadius="md"
      boxShadow="sm"
      overflow="hidden"
      border="1px solid"
      borderColor={borderColor}
      bg="white"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box 
        p={3}
        fontWeight="semibold"
        bgGradient={bgGradient}
        borderBottom={`1px solid ${borderColor}`}
      >
        <Heading as="h3" size="sm">Assistance</Heading>
      </Box>
      
      <Box 
        className="assistance-content" 
        p={4} 
        fontSize="sm" 
        overflowY="auto"
        flex="1"
      >
        <ReactMarkdown>{response}</ReactMarkdown>
      </Box>
    </Box>
  );
}

export default AssistanceOutput;
