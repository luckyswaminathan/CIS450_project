import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import { Text } from '@chakra-ui/react'
function SentimentByState() {
  const [data, setData] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [stateAbbreviation, setStateAbbreviation] = useState(''); // To hold state abbreviation
  const [topic, setTopic] = useState(''); // To hold topic

  const handleStateAbbreviationChange = (event) => {
    setStateAbbreviation(event.target.value);
  };

  const handleTopicChange = (event) => {
    setTopic(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    const url = `http://localhost:3001/api/sentiment/state?state_code=${stateAbbreviation}&topic=${topic}`;
    console.log("Fetching data from:", url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
      console.log("Data updated:", data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (

      <VStack spacing={100}>
        <Box>
          <h1 className='text-center'>Sentiment by State</h1>
          <p className='text-small'>Provides breakdown of sentiment analysis for topics within specified state</p>
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={100}>
            <Box bgSize={100}>
              <Textarea
                value={stateAbbreviation}
                onChange={handleStateAbbreviationChange}
                placeholder="State abbreviation (eg. CA)"
              />
            </Box>
            <Box bgSize={100}>
              <Textarea
                value={topic}
                onChange={handleTopicChange}
                placeholder="Enter topic (optional)"
              />
            </Box>
            <Button type="submit" colorScheme="blue">Submit</Button>
          </VStack>
        </form>
        {data.length > 0 && (
          <VStack spacing={4} key={refreshKey}>
            {data.map((item) => (
              <Box key={item.TOPIC}>
                <Flex marginLeft={20}>
                <Text>
                  STATE: {item.STATE},
                  TOPIC: {item.TOPIC},
                  POSITIVE_COUNT: {item.POSITIVE_COUNT},
                  NEGATIVE_COUNT: {item.NEGATIVE_COUNT},
                  NEUTRAL_COUNT: {item.NEUTRAL_COUNT}
                </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
        
        {data.length === 0 && (
          <Text>Loading...</Text>
        )}
      </VStack>

  );
}

export default SentimentByState;