import React, { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Input,
  Button,
  Text,
  useToast,
  Flex,
  Heading,
  Code,
} from '@chakra-ui/react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const toast = useToast();

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();
      const assistantMessage: Message = { 
        role: data.role || 'assistant', 
        content: data.response || data.content 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get response from the assistant',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Format calculation details for display
  const formatCalculationDetails = (details: any) => {
    return `🚀 Interstellar Trade Calculation Analysis 🚀

ROUTE
From: ${details.sourcePlanet}
To: ${details.destinationPlanet}
Distance: ${details.distance.toFixed(2)} AU (${(details.distance * 149597870.7).toFixed(0)} million km)

TRAVEL TIME
• Earth observer time: ${details.travelTime.toFixed(1)} days
• Ship crew time: ${details.shipTime.toFixed(1)} days
• Time dilation factor: ${details.timeDilation.toFixed(4)}

ECONOMIC DETAILS
• Payment type: ${details.paymentType === 'upfront' ? 'Upfront payment' : 'Payment on delivery'}
• Base annual interest rate: 5%
• Effective interest rate: ${(details.interestRate * 100).toFixed(4)}%
• Total cost: ${details.totalCost.toFixed(2)} credits

THEORETICAL BACKGROUND
According to Krugman's "Theory of Interstellar Trade" (1978):
1. Interest rates must be calculated in proper time (ship time) for the trader's reference frame
2. Different time rates create arbitrage opportunities
3. Time dilation affects both the goods' delivery and the interest payments

The calculations follow Einstein's special relativity:
• Time dilation: t' = t/γ where γ = 1/√(1 - v²/c²)
• At 10% light speed, time dilation is small but measurable
• Earth time > Ship time due to relativistic effects`;
  };

  return (
    <Box p={6} bg="white" borderRadius="xl" boxShadow="lg" h="100%" display="flex" flexDirection="column">
      <Heading size="lg" mb={4}>Planet Information</Heading>
      
      <Box flex={1} overflowY="auto" mb={4}>
        {messages.map((message, index) => (
          <Flex
            key={index}
            justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
            mb={4}
          >
            <Box
              bg={message.role === 'user' ? 'blue.100' : message.role === 'system' ? 'green.100' : 'gray.100'}
              p={4}
              borderRadius="lg"
              maxW="90%"
              whiteSpace="pre-wrap"
              fontFamily={message.role === 'system' ? 'mono' : 'inherit'}
              fontSize={message.role === 'system' ? 'sm' : 'md'}
              boxShadow="sm"
            >
              <Text>{message.content}</Text>
            </Box>
          </Flex>
        ))}
      </Box>

      <Flex gap={2}>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about planets..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          size="lg"
        />
        <Button
          colorScheme="blue"
          onClick={handleSend}
          size="lg"
        >
          Send
        </Button>
      </Flex>
    </Box>
  );
}; 