import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button, Text } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'

function StateAffiliation() {
  const [data, setData] = useState('');


  const [refreshKey, setRefreshKey] = useState(0);

  const [textValue, setTextValue] = useState(10);

  const handleChange = (event) => {
    setTextValue(event);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    console.log(textValue)
    const url = `http://localhost:3001/api/topics/state-affiliation?limit=${textValue}`;
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
          <h1 className='text-center'>Topics Discussed by State Affiliation</h1>
          <p className='text-small'>A query to identify topics talked about most per state</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <Box bgSize={100}>
        <NumberInput step={5} defaultValue={15} min={10} max={50} onChange={setTextValue}>
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
              <Box key={item.TOPIC_COUNT}>
                <Text>
                  STATE: {item.STATE},
                  POLITICAL_AFFILIATION: {item.POLITICAL_AFFILIATION === "" ? "NONE" : item.POLITICAL_AFFILIATION},
                  TOPIC: {item.TOPIC}, 
                  TOPIC_COUNT: {item.TOPIC_COUNT}
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

export default StateAffiliation;