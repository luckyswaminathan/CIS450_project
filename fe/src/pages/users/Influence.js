import React, { useState } from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button, Text } from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

function Influence() {
  const [data, setData] = useState([]);
  const [textValue, setTextValue] = useState(1000);

  const handleChange = (valueString) => {
    setTextValue(parseInt(valueString));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3001/api/influence?minFollowers=${textValue}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // Clear data on error
    }
  };

  return (
    <Flex>
      <Spacer />
      <VStack spacing={8}>
        <Box>
          <h1 className='text-center'>Users With Influence</h1>
          <p className='text-small'>Query to return users with high influence based on a minimum amount of followers</p>
        </Box>
        <form onSubmit={handleSubmit}>
          <HStack>
            <NumberInput step={500} value={textValue} min={50} max={100000} onChange={handleChange}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Text ml={2}>Minimum Followers</Text>
          </HStack>
          <Button type="submit" colorScheme="blue" mt={4}>Submit</Button>
        </form>
        {data.length > 0 ? (
          <VStack spacing={4}>
            {data.map((item) => (
              <Box key={item.USER_ID} p={4} boxShadow="md">
                <Text>
                  USER_ID: {item.USER_ID},
                  USER_HANDLE: {item.USER_HANDLE},
                  FOLLOWERS: {item.FOLLOWERS},
                  POLITICAL_AFFILIATION: {item.POLITICAL_AFFILIATION || "NONE"},
                  AVG_ENGAGEMENT: {item.AVG_ENGAGEMENT}
                </Text>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text>Loading or no data available...</Text>
        )}
      </VStack>
      <Spacer />
    </Flex>
  );
}

export default Influence;