import React from 'react';
import { 
  Modal as ChakraModal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalFooter, 
  ModalBody, 
  ModalCloseButton,
  Button,
  useColorModeValue
} from '@chakra-ui/react';

function Modal({ children, onClose, title = "Information" }) {
  const headerBg = useColorModeValue('linear(to-r, #6366f1, #8b5cf6)', 'linear(to-r, #4f46e5, #7c3aed)');
  
  return (
    <ChakraModal isOpen={true} onClose={onClose} isCentered>
      <ModalOverlay 
        bg="blackAlpha.300"
        backdropFilter="blur(5px)"
      />
      <ModalContent 
        borderRadius="md" 
        boxShadow="xl"
        maxW="90vw"
        w="auto"
      >
        <ModalHeader 
          bgGradient={headerBg}
          color="white"
          borderTopRadius="md"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody py={4}>
          {children}
        </ModalBody>

        <ModalFooter>
          <Button 
            colorScheme="purple" 
            onClick={onClose}
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </ChakraModal>
  );
}

export default Modal;
