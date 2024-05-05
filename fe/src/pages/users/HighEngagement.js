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

function HighEngagement() {
  const [data, setData] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [thresholdValue, setThreshold] = useState(50);
  const [minEngagement, setMinEngagement] = useState(5);
  const [compareType, setCompareType] = useState('sentiment');
  const [directionType, setDirectionType] = useState('<');
  const handleChange = (event) => {
    setThreshold(event);
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const validatedCompareType = compareType !== 'sentiment' && compareType !== 'bias' ? 'sentiment' : compareType;
    const validatedDirectionType = directionType !== '<' && directionType !== '>' ? '<' : directionType;
    
    console.log("Submit button clicked!");
    const url = `http://localhost:3001/api/users/high-engagement?followersThreshold=${thresholdValue}&engagementThreshold=${minEngagement}&compareType=${validatedCompareType}&compareDirection=${validatedDirectionType}`;
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
          <h1 className='text-center'>High Engagement Users</h1>
          <p className='text-small'>a query to identify users with engagement higher than a certain threshold</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={50}>
        <Box bgSize={100}>
          <NumberInput step={5} defaultValue={50} min={10} max={130} onChange={setThreshold}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <Box>
        <NumberInput step={0.2} defaultValue={5} min={0} max={100} onChange={setMinEngagement}>
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
        <Box>
          <Textarea placeholder="Enter comparison type" size="md" onChange={setCompareType} />
        </Box>
        <Box>
          <Textarea placeholder="Enter direction type" size="md" onChange={setDirectionType} />
        </Box>


        
        </VStack>
        <Button type="submit" colorScheme="blue">Submit</Button>
      </form>
      {data.length > 0 && (
          <VStack spacing={4} key={refreshKey}>
            {data.map((item) => (
              <Box key={item.user_handle}>
                <Text>
                  
                  FOLLOWERS: {item.followers},
                  AVG_ENGAGEMENT: {item.avg_engagement},
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

export default HighEngagement;