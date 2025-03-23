import React, { useState, useRef } from 'react';
import { 
  Button, 
  Tooltip, 
  useToast,
  HStack
} from '@chakra-ui/react';
import { 
  FaBook, 
  FaLanguage, 
  FaVolumeUp, 
  FaCheck 
} from 'react-icons/fa';

function Editor({ onHighlight, onGetAssistance, onPronounce, hideLanguageSelect = false }) {
  const [content, setContent] = useState('');
  const editorRef = useRef(null);
  const toast = useToast();

  const getSelectedText = () => {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (editorRef.current.contains(range.commonAncestorContainer)) {
          const selectedText = selection.toString().trim();
          console.log('Selected text:', selectedText); // Debug log
          return selectedText;
        }
      }
    }
    console.log('No text selected'); // Debug log
    return '';
  };

  const handleHighlight = (type) => {
    const selectedText = getSelectedText();
    if (selectedText) {
      console.log(`Sending ${type} request for:`, selectedText); // Debug log
      onHighlight(selectedText, type);
      
      // Show toast notification
      toast({
        title: type === 'D' ? 'Getting definition...' : 'Getting conjugation...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: 'No text selected',
        description: 'Please select some text first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handleGetAssistance = () => {
    if (content.trim()) {
      onGetAssistance(content);
      
      toast({
        title: 'Getting assistance...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: 'Empty content',
        description: 'Please enter some text first',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  const handlePronounce = () => {
    const selectedText = getSelectedText();
    if (selectedText) {
      onPronounce(selectedText);
      
      toast({
        title: 'Pronouncing text...',
        status: 'info',
        duration: 2000,
        isClosable: true,
        position: 'top-right',
      });
    } else {
      toast({
        title: 'No text selected',
        description: 'Please select some text to pronounce',
        status: 'warning',
        duration: 3000,
        isClosable: true,
        position: 'top-right',
      });
    }
  };

  return (
    <div className="editor">
      <div className="toolbar">
        <div className="toolbar-left">
          <HStack spacing={2}>
            <Tooltip label="Define selected text" placement="top">
              <Button 
                onClick={() => handleHighlight('D')} 
                className="action-btn"
                size="sm"
                leftIcon={<FaBook />}
              >
                Define
              </Button>
            </Tooltip>
            
            <Tooltip label="Conjugate selected verb" placement="top">
              <Button 
                onClick={() => handleHighlight('C')} 
                className="action-btn"
                size="sm"
                leftIcon={<FaLanguage />}
              >
                Conjugate
              </Button>
            </Tooltip>
            
            <Tooltip label="Pronounce selected text" placement="top">
              <Button 
                onClick={handlePronounce} 
                className="action-btn"
                size="sm"
                leftIcon={<FaVolumeUp />}
              >
                Pronounce
              </Button>
            </Tooltip>
          </HStack>
        </div>
        
        <Tooltip label="Get writing assistance" placement="top">
          <Button 
            onClick={handleGetAssistance} 
            className="action-btn get-assistance-btn"
            size="sm"
            leftIcon={<FaCheck />}
          >
            Get Assistance
          </Button>
        </Tooltip>
      </div>
      
      <div
        ref={editorRef}
        className="content"
        contentEditable
        onInput={(e) => setContent(e.target.innerHTML)}
        placeholder="Type or paste your Spanish text here..."
      />
    </div>
  );
}

export default Editor;
