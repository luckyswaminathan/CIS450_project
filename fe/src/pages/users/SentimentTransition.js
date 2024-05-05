import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button,Text } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

function SentimentTransition() {
  const [data, setData] = useState('');


  const [refreshKey, setRefreshKey] = useState(0);

  const [textValue, setTextValue] = useState(1000);

  const handleChange = (event) => {
    setTextValue(event);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    console.log(textValue)
    const url = `http://localhost:3001/api/users/sentiment-transition?followerThreshold=${textValue}`;
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
    <Flex >

        <Spacer />
        <VStack spacing={100}>
        <Box>
          <h1 className='text-center'>Sentiment Transition</h1>
          <p className='text-small'>a query to identify users who have a significant transition of sentiment over time</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <Box bgSize={100}>
        <NumberInput step={500} defaultValue={1000} min={50} max={100000} onChange={setTextValue}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <Button type="submit" colorScheme="blue">Submit</Button>
      </form>
      {data.length > 0 && (
          <VStack spacing={4} key={refreshKey}>
            {data.map((item) => (
              <Box key={item.USER_ID}>
                <Flex marginLeft={20}>
                <Text>
                  USER_ID: {item.USER_ID},
                  USER_HANDLE: {item.USER_HANDLE},
                  TRANSITION: {item.TRANSITION},
                  PRE_ENGAGEMENT_RATIO: {item.PRE_ENGAGEMENT_RATIO},
                  POST_ENGAGEMENT_RATIO: {item.POST_ENGAGEMENT_RATIO},
                  ENGAGEMENT_DIFFERENCE: {item.ENGAGEMENT_DIFF}
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
        <Spacer />
        
      </Flex>
  );
}

export default SentimentTransition;