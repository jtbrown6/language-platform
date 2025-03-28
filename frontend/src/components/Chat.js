import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Flex, 
  Input, 
  Text, 
  IconButton,
  useColorModeValue,
  Divider
} from '@chakra-ui/react';
import { FaPaperPlane, FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

function Chat({ onSendMessage, chatHistory, onResetConversation }) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatMessagesRef = useRef(null);
  const inputRef = useRef(null);
  const borderColor = useColorModeValue('rgba(99, 102, 241, 0.2)', 'rgba(139, 92, 246, 0.3)');
  const headerBg = useColorModeValue('linear(to-r, #f8fafc, #f1f5f9)', 'linear(to-r, gray.700, gray.800)');
  const userBubbleBg = useColorModeValue('rgba(99, 102, 241, 0.1)', 'rgba(99, 102, 241, 0.3)');
  const assistantBubbleBg = useColorModeValue('rgba(139, 92, 246, 0.1)', 'rgba(139, 92, 246, 0.3)');

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      setIsLoading(true);
      await onSendMessage(message);
      setMessage('');
      setIsLoading(false);
      // Focus back on the input after sending
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <Box 
      className="chat"
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
        className="chat-header"
        p={3}
        fontWeight="semibold"
        alignItems="center"
        justifyContent="space-between"
        bgGradient={headerBg}
        borderBottom={`1px solid ${borderColor}`}
      >
        <Text>Chat Assistant</Text>
        <IconButton
          icon={<FaTrash />}
          onClick={onResetConversation}
          size="sm"
          colorScheme="red"
          variant="ghost"
          aria-label="Reset conversation"
        />
      </Flex>
      
      <Box 
        className="chat-messages" 
        ref={chatMessagesRef}
        flex="1"
        overflowY="auto"
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        {chatHistory.length === 0 && (
          <Text color="gray.500" textAlign="center" fontSize="sm" my={4}>
            Start a conversation with the assistant
          </Text>
        )}
        
        {chatHistory.map((msg, index) => (
          <Box 
            key={index} 
            className={`chat-message ${msg.role}`}
            alignSelf={msg.role === 'user' ? 'flex-end' : 'flex-start'}
            maxWidth="85%"
            p={3}
            borderRadius="lg"
            bg={msg.role === 'user' ? userBubbleBg : assistantBubbleBg}
            borderBottomRightRadius={msg.role === 'user' ? 0 : undefined}
            borderBottomLeftRadius={msg.role === 'assistant' ? 0 : undefined}
          >
            <Text fontWeight="bold" fontSize="xs" mb={1}>
              {msg.role === 'user' ? 'You' : 'Assistant'}
            </Text>
            <Box fontSize="sm">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </Box>
          </Box>
        ))}
        
        {isLoading && (
          <Box 
            className="chat-message assistant"
            alignSelf="flex-start"
            maxWidth="85%"
            p={3}
            borderRadius="lg"
            bg={assistantBubbleBg}
            borderBottomLeftRadius={0}
          >
            <Text fontWeight="bold" fontSize="xs" mb={1}>
              Assistant
            </Text>
            <Text fontSize="sm">Thinking...</Text>
          </Box>
        )}
      </Box>
      
      <Divider borderColor={borderColor} />
      
      <Flex 
        as="form"
        onSubmit={handleSubmit}
        className="chat-input"
        p={3}
        alignItems="center"
        gap={2}
        bgGradient={headerBg}
      >
        <Input
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
          size="md"
          borderColor={borderColor}
          _focus={{
            borderColor: 'brand.primary',
            boxShadow: '0 0 0 1px rgba(99, 102, 241, 0.6)'
          }}
          autoFocus
        />
        <IconButton
          icon={<FaPaperPlane />}
          type="submit"
          disabled={isLoading || !message.trim()}
          colorScheme="purple"
          aria-label="Send message"
          isLoading={isLoading}
        />
      </Flex>
    </Box>
  );
}

export default Chat;
