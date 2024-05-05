import React, { useState } from 'react';
import { VStack, Box, Button, Text, Textarea, Select } from '@chakra-ui/react';

function SentimentByState() {
  const [data, setData] = useState([]);
  const [stateAbbreviation, setStateAbbreviation] = useState('');
  const [topic, setTopic] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3001/api/sentiment/state?state_code=${stateAbbreviation}&topic=${topic}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <VStack spacing={8}>
      <Box>
        <h1 className='text-center'>Sentiment by State</h1>
        <p className='text-small'>Provides breakdown of sentiment analysis for topics within specified state</p>
      </Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Box>
            <Select 
              placeholder="Select state or choose optional"
              value={stateAbbreviation}
              onChange={(e) => setStateAbbreviation(e.target.value)}>
              <option value="">No State Chosen</option>
              {['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 
                'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 
                'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'].map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </Select>
          </Box>
          <Box>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter topic (optional)"
            />
          </Box>
          <Button type="submit" colorScheme="blue">Submit</Button>
        </VStack>
      </form>
      {data.length > 0 ? (
        <VStack spacing={4}>
          {data.map((item, index) => (
            <Box key={index}>
              <Text>
                STATE: {item.state},
                TOPIC: {item.topic},
                POSITIVE_COUNT: {item.positive_count},
                NEGATIVE_COUNT: {item.negative_count},
                NEUTRAL_COUNT: {item.neutral_count}
              </Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text>{data.length === 0 ? 'No data available.' : 'Loading...'}</Text>
      )}
    </VStack>
  );
}

export default SentimentByState;