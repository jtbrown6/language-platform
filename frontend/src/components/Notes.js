import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Heading, 
  Textarea,
  useColorModeValue,
  Text,
  Spinner,
  Flex
} from '@chakra-ui/react';

function Notes() {
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const saveTimeoutRef = useRef(null);
  
  const borderColor = useColorModeValue('rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.3)');
  const headerBg = useColorModeValue('linear(to-r, #f8fafc, #f1f5f9)', 'linear(to-r, gray.700, gray.800)');

  // Fetch notes from backend on component mount
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
        const response = await fetch(`${apiBaseUrl}/api/notes`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }
        
        const data = await response.json();
        setNotes(data.content || '');
        setLastSaved(data.last_updated ? new Date(data.last_updated) : null);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setSaveError('Failed to load notes');
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Debounced save function
  const saveNotes = async (content) => {
    try {
      setIsSaving(true);
      setSaveError('');
      
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001';
      const response = await fetch(`${apiBaseUrl}/api/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save notes');
      }
      
      setLastSaved(new Date());
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving notes:', error);
      setSaveError('Failed to save notes');
      setIsSaving(false);
    }
  };

  // Handle notes change with debounced auto-save
  const handleNotesChange = (e) => {
    const newContent = e.target.value;
    setNotes(newContent);
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Set new timeout to save after 2 seconds of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      saveNotes(newContent);
    }, 2000);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Format last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diff = Math.floor((now - lastSaved) / 1000); // difference in seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return lastSaved.toLocaleDateString();
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
        <Flex justify="space-between" align="center">
          <Heading as="h3" size="sm">My Notes</Heading>
          <Flex align="center" gap={2}>
            {isSaving && (
              <>
                <Spinner size="xs" />
                <Text fontSize="xs" color="gray.500">Saving...</Text>
              </>
            )}
            {!isSaving && lastSaved && (
              <Text fontSize="xs" color="gray.500">
                Saved {formatLastSaved()}
              </Text>
            )}
            {saveError && (
              <Text fontSize="xs" color="red.500">{saveError}</Text>
            )}
          </Flex>
        </Flex>
      </Box>
      
      <Box className="notes-content" p={4} flex="1">
        {isLoading ? (
          <Flex justify="center" align="center" height="100%">
            <Spinner size="lg" />
          </Flex>
        ) : (
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
        )}
      </Box>
    </Box>
  );
}

export default Notes;
