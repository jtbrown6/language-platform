import React from 'react';
import { 
  Box, 
  Heading, 
  Flex, 
  useColorModeValue
} from '@chakra-ui/react';
import ReactMarkdown from 'react-markdown';

function OutputPane({ title, content, defaultOpen = true }) {
  const bgGradient = useColorModeValue('linear(to-r, #f8fafc, #f1f5f9)', 'linear(to-r, gray.700, gray.800)');
  const borderColor = useColorModeValue('rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.3)');
  const headerBg = useColorModeValue('linear(to-r, #f8fafc, #f1f5f9)', 'linear(to-r, gray.700, gray.800)');

  const renderTable = (tableContent) => {
    const rows = tableContent.split('\n').filter(row => row.trim() !== '');
    return (
      <Box as="table" width="100%" borderCollapse="collapse" my={2} fontSize="sm">
        <Box as="thead">
          <Box as="tr">
            {rows[0].split('|').filter(cell => cell.trim()).map((cell, index) => (
              <Box 
                as="th" 
                key={index} 
                border="1px solid" 
                borderColor={borderColor}
                p={2}
                bg={headerBg}
              >
                {cell.trim()}
              </Box>
            ))}
          </Box>
        </Box>
        <Box as="tbody">
          {rows.slice(2).map((row, rowIndex) => (
            <Box as="tr" key={rowIndex}>
              {row.split('|').filter(cell => cell.trim()).map((cell, cellIndex) => (
                <Box 
                  as="td" 
                  key={cellIndex} 
                  border="1px solid" 
                  borderColor={borderColor}
                  p={2}
                >
                  {cell.trim()}
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderConjugationContent = () => {
    const parts = content.split('##').filter(part => part.trim() !== '');
    
    return (
      <Box>
        {parts.map((part, index) => {
          const [title, ...contentLines] = part.split('\n');
          const tableContent = contentLines.join('\n');
          return (
            <Box key={index} mb={4}>
              <Heading as="h3" size="sm" mb={2}>{title.trim()}</Heading>
              {renderTable(tableContent)}
            </Box>
          );
        })}
      </Box>
    );
  };

  return (
    <Box 
      className={`output-pane ${title.toLowerCase()}`}
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
      <Flex 
        className="output-header"
        p={3}
        fontWeight="semibold"
        alignItems="center"
        justifyContent="space-between"
        bgGradient={bgGradient}
        borderBottom={`1px solid ${borderColor}`}
      >
        <Box>{title}</Box>
      </Flex>
      
      <Box 
        className="output-content" 
        p={4} 
        fontSize="sm" 
        overflowY="auto" 
        flex="1"
      >
        {content ? (
          content.includes('|') ? renderConjugationContent() : <ReactMarkdown>{content}</ReactMarkdown>
        ) : (
          <Box color="gray.500" textAlign="center">
            {title === 'Definition' ? 'Select text and click "Define" to see definitions' : 
             title === 'Conjugation' ? 'Select a verb and click "Conjugate" to see conjugations' : 
             'No content available'}
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default OutputPane;
