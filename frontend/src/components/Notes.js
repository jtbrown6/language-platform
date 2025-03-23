import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Heading, 
  Textarea,
  useColorModeValue
} from '@chakra-ui/react';

function Notes() {
  const [notes, setNotes] = useState(() => {
    // Load notes from localStorage if available
    const savedNotes = localStorage.getItem('spanishLearningNotes');
    return savedNotes || '';
  });
  
  const borderColor = useColorModeValue('rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.3)');
  const headerBg = useColorModeValue('linear(to-r, #f8fafc, #f1f5f9)', 'linear(to-r, gray.700, gray.800)');

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('spanishLearningNotes', notes);
  }, [notes]);

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  return (
    <Box 
      className="notes-box"
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
        className="notes-header"
        p={3}
        fontWeight="semibold"
        bgGradient={headerBg}
        borderBottom={`1px solid ${borderColor}`}
      >
        <Heading as="h3" size="sm">My Notes</Heading>
      </Box>
      
      <Box className="notes-content" p={4} flex="1">
        <Textarea
          className="notes-textarea"
          value={notes}
          onChange={handleNotesChange}
          placeholder="Take notes here as you learn..."
          height="100%"
          border="none"
          _focus={{ border: 'none', boxShadow: 'none' }}
          resize="none"
        />
      </Box>
    </Box>
  );
}

export default Notes;
