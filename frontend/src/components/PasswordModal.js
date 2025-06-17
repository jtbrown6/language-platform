import React, { useState } from 'react';
import { 
  Input, 
  Button, 
  FormControl, 
  FormLabel, 
  FormErrorMessage,
  VStack,
  Text,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Modal from './Modal';
import { useAuth } from '../context/AuthContext';

function PasswordModal() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!password) {
      setError('Password is required');
      return;
    }
    
    const isAuthenticated = login(password);
    
    if (!isAuthenticated) {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Modal title="Authentication Required" onClose={() => {}}>
      <VStack spacing={4} align="stretch">
        <Text>
          This application requires authentication to protect API usage.
          Please enter the password to continue.
        </Text>
        
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!error}>
            <FormLabel htmlFor="password">Password</FormLabel>
            <InputGroup>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter password"
                autoFocus
              />
              <InputRightElement>
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                  onClick={togglePasswordVisibility}
                  variant="ghost"
                  size="sm"
                />
              </InputRightElement>
            </InputGroup>
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          
          <Button
            mt={4}
            colorScheme="purple"
            type="submit"
            width="100%"
          >
            Submit
          </Button>
        </form>
      </VStack>
    </Modal>
  );
}

export default PasswordModal;
