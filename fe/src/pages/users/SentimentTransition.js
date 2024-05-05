import React, {useState} from 'react';
import {
  VStack, HStack, Flex, Spacer, Box, Button, Text,
  NumberInput, NumberInputField, NumberInputStepper,
  NumberIncrementStepper, NumberDecrementStepper,
  FormControl, FormLabel
} from '@chakra-ui/react';

function SentimentTransition() {
  const [data, setData] = useState([]);
  const [textValue, setTextValue] = useState(1000);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    const url = `http://localhost:3001/api/users/sentiment-transition?followerThreshold=${textValue}`;
    console.log("Fetching data from:", url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
      console.log("Data updated:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" p={5}>
      <Box textAlign="center" mb="5">
        <h1 className='text-center'>Sentiment Transition</h1>
        <p className='text-small'>
          A query to identify users who have a significant transition of sentiment over time.
        </p>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormControl id="followerThreshold">
          <FormLabel>Minimum Follower Threshold</FormLabel>
          <NumberInput step={500} defaultValue={1000} min={50} max={100000} onChange={setTextValue}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <Button type="submit" colorScheme="blue" mt="4">Submit</Button>
      </form>
      {data.length > 0 ? (
        <VStack spacing={4}>
          {data.map((item, index) => (
            <Box key={index}>
              <Text>
                USER_ID: {item.USER_ID},
                USER_HANDLE: {item.USER_HANDLE},
                TRANSITION: {item.TRANSITION},
                PRE_ENGAGEMENT_RATIO: {item.PRE_ENGAGEMENT_RATIO},
                POST_ENGAGEMENT_RATIO: {item.POST_ENGAGEMENT_RATIO},
                ENGAGEMENT_DIFFERENCE: {item.ENGAGEMENT_DIFF}
              </Text>
            </Box>
          ))}
        </VStack>
      ) : (
        <Text mt="4">Loading or no data available...</Text>
      )}
    </Flex>
  );
}

export default SentimentTransition;