import React, { useState } from 'react';
import { 
  Box, 
  Grid, 
  GridItem,
  Heading
} from '@chakra-ui/react';
import Editor from './components/Editor';
import Chat from './components/Chat';
import OutputPane from './components/OutputPane';
import Notes from './components/Notes';
import ReactMarkdown from 'react-markdown';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [definitionOutput, setDefinitionOutput] = useState('');
  const [conjugationOutput, setConjugationOutput] = useState('');
  const [assistanceOutput, setAssistanceOutput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [language] = useState('spanish'); // Fixed to Spanish only

  const handleHighlight = async (text, type) => {
    console.log(`Handling ${type} request for:`, text);
    try {
      let endpoint;
      let body;
      if (type === 'D') {
        endpoint = `${API_BASE_URL}/api/define`;
        body = { word: text };
      } else if (type === 'C') {
        endpoint = `${API_BASE_URL}/api/conjugate`;
        body = { verb: text };
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log(`${type} API response:`, data);

      if (type === 'D') {
        setDefinitionOutput(data.result);
      } else if (type === 'C') {
        const formattedConjugation = formatConjugation(data.result);
        setConjugationOutput(formattedConjugation);
      }
    } catch (error) {
      console.error(`Error fetching ${type === 'D' ? 'definition' : 'conjugation'}:`, error);
    }
  };

  const formatConjugation = (conjugationData) => {
    console.log('Formatting conjugation data:', conjugationData);
    const tenses = ['present', 'subjunctive', 'preterite', 'imperfect', 'future'];
    const personOrder = ['yo', 'tú', 'él/ella/usted', 'nosotros', 'ellos/ellas/ustedes'];
    let formattedOutput = '';

    tenses.forEach(tense => {
      if (conjugationData[tense]) {
        formattedOutput += `## ${tense.charAt(0).toUpperCase() + tense.slice(1)}\n\n`;
        formattedOutput += '| Person | Conjugation |\n';
        formattedOutput += '|--------|-------------|\n';
        personOrder.forEach(person => {
          let displayPerson = person;
          if (person === 'él/ella/usted') displayPerson = 'El/Ella';
          if (person === 'ellos/ellas/ustedes') displayPerson = 'Ellos/Ellas';
          formattedOutput += `| ${displayPerson} | ${conjugationData[tense][person]} |\n`;
        });
        formattedOutput += '\n';
      }
    });

    console.log('Formatted conjugation output:', formattedOutput);
    return formattedOutput;
  };

  const handleGetAssistance = async (text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/assist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, language }),
      });
      const data = await response.json();
      setAssistanceOutput(data.result);
    } catch (error) {
      console.error('Error fetching assistance:', error);
    }
  };

  const handleChat = async (query) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chatbot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await response.json();
      const newMessage = { role: 'user', content: query };
      const newResponse = { role: 'assistant', content: data.result };
      setChatHistory(prevHistory => [...prevHistory, newMessage, newResponse]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
    }
  };

  const handleResetConversation = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/reset_conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setChatHistory([]);
    } catch (error) {
      console.error('Error resetting conversation:', error);
    }
  };

  const handlePronounce = async (text) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/pronounce`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: text }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get pronunciation');
      }
      
      const data = await response.json();
      console.log('Pronunciation data:', data);
      
      if (data.audio) {
        // Convert base64 audio content to audio blob
        const audioData = atob(data.audio);
        const arrayBuffer = new ArrayBuffer(audioData.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < audioData.length; i++) {
          uint8Array[i] = audioData.charCodeAt(i);
        }
        const audioBlob = new Blob([uint8Array], { type: 'audio/mp3' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        // Add a slight delay before playing
        setTimeout(() => {
          audio.play();
        }, 500); // 500ms delay
        
        // Clean up the URL after playing
        audio.onended = () => {
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('Error fetching pronunciation:', error);
    }
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1 className="app-title">Spanish Learning Assistant</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="container">
        {/* Top Section: Editor and Assistance side by side */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4} mb={4} className="top-section">
          <GridItem>
            <Editor 
              onHighlight={handleHighlight} 
              onGetAssistance={handleGetAssistance}
              onPronounce={handlePronounce}
              hideLanguageSelect={true}
            />
          </GridItem>
          <GridItem>
            <Box 
              className="assistance-box"
              borderRadius="md"
              boxShadow="sm"
              overflow="hidden"
              border="1px solid rgba(99, 102, 241, 0.2)"
              bg="white"
              height="100%"
              display="flex"
              flexDirection="column"
            >
              <Box 
                p={3}
                fontWeight="semibold"
                bgGradient="linear(to-r, #f8fafc, #f1f5f9)"
                borderBottom="1px solid rgba(99, 102, 241, 0.2)"
              >
                <Heading as="h3" size="sm">Assistance</Heading>
              </Box>
              <Box 
                p={4} 
                fontSize="sm" 
                overflowY="auto" 
                flex="1"
                className="assistance-content"
              >
                {assistanceOutput ? (
                  <ReactMarkdown>{assistanceOutput}</ReactMarkdown>
                ) : (
                  <Box color="gray.500" textAlign="center">
                    Get assistance with your Spanish text by clicking "Get Assistance"
                  </Box>
                )}
              </Box>
            </Box>
          </GridItem>
        </Grid>

        {/* Bottom Section: Four widgets in a row */}
        <Grid templateColumns="repeat(4, 1fr)" gap={4} className="bottom-section">
          <GridItem>
            <OutputPane title="Definition" content={definitionOutput} defaultOpen={true} />
          </GridItem>
          <GridItem>
            <OutputPane title="Conjugation" content={conjugationOutput} defaultOpen={true} />
          </GridItem>
          <GridItem>
            <Chat 
              onSendMessage={handleChat} 
              chatHistory={chatHistory} 
              onResetConversation={handleResetConversation}
            />
          </GridItem>
          <GridItem>
            <Notes />
          </GridItem>
        </Grid>
      </div>
    </div>
  );
}

export default App;
