import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button, Text} from '@chakra-ui/react'

import { Textarea } from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

function UserEngagement() {
  const format = (val) => val;
  const parse = (val) => val.replace(/^\$/, '');
  const [data, setData] = useState([]);
  const [minValue, setMinValue] = useState(-0.99);
  const [refreshKey, setRefreshKey] = useState(0);
 
  const handleChange = (value) => {
    console.log("Min value changed to:", value);
    setMinValue(value);
  };


  const [maxValue, setMaxValue] = useState(0.99);
  const handleMaxChange = (event) => {
    console.log("Max value changed to:", event);
    setMaxValue(event);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    const url = `http://localhost:3001/api/users/user-engagement?min_sentiment=${minValue}&max_sentiment=${maxValue}`;
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
          <h1 className='text-center'>User Engagement and Sentiment Analysis</h1>
          <p className='text-small'>Returns correlation between user engagement and sentiment</p>
 
        </Box>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={30}>
        <Box bgSize={100}>
          <h2>Enter Sentiment Range</h2>

        
        <p>Min: </p>

        <NumberInput
            onChange={(valueString) => {
              const parsedValue = parse(valueString);
              handleChange(parsedValue);
            }}
            defaultValue={0.0}
            type="number"
            value={minValue}
            max={0.99}
            min={-0.99}
            precision={2}
            step={0.05}
          >
            <NumberInputField pattern="(-)?[0-9]+(\.[0-9]+)?"  />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>


        </Box>
        <Box bgSize={100}>
          <p>Max: </p>
          <NumberInput
            onChange={(valueString) => {
              const parsedValue = parse(valueString);
              handleMaxChange(parsedValue);
            }}
            defaultValue={0.0}
            type="number"
            value={maxValue}
            max={0.99}
            min={-0.99}
            precision={2}
            step={0.05}
          >
            <NumberInputField pattern="(-)?[0-9]+(\.[0-9]+)?"  />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>

        </Box>
        <Button type="submit" colorScheme="blue">Submit</Button>
        </VStack>
      </form>

      {data.length > 0 && (
          <VStack spacing={4} key={refreshKey}>
            {data.map((item) => (
              <Box key={item.USER_ID}>
                <Text>
                  User ID: {item.USER_ID} + 
                  Avg Likes: {item.AVG_LIKES} + 
                  Avg Retweets: {item.AVG_RETWEETS} + 
                  Avg Sentiment: {item.AVG_SENTIMENT} + 
                </Text>
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

export default UserEngagement;