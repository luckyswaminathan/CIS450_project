import React, { useState } from 'react';
import { VStack, HStack, Flex, Box, Button, Text, Select, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from '@chakra-ui/react';

function HighEngagement() {
  const [data, setData] = useState([]);
  const [thresholdValue, setThreshold] = useState(50);
  const [minEngagement, setMinEngagement] = useState(5);
  const [compareType, setCompareType] = useState('sentiment');
  const [directionType, setDirectionType] = useState('<');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const url = `http://localhost:3001/api/users/high-engagement?followersThreshold=${thresholdValue}&engagementThreshold=${minEngagement}&compareType=${compareType}&compareDirection=${directionType}`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]); // clear previous data on error
    }
  };

  return (
    <Flex direction="column" align="center" justify="center" minH="100vh" p={4}>
      <VStack spacing={4} w="full" maxW="md" boxShadow="md" borderRadius="md" overflow="hidden">
      <Text fontSize="24px" fontWeight="bold">High Engagement Users</Text>
        <Text>Identify users with engagement higher than a certain threshold</Text>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing={4}>
            <HStack w="full">
              <Text w="50%">Followers Threshold:</Text>
              <NumberInput step={5} value={thresholdValue} min={10} max={1000000} onChange={value => setThreshold(value)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <HStack w="full">
              <Text w="50%">Minimum Engagement:</Text>
              <NumberInput step={0.2} value={minEngagement} min={0} max={1000} onChange={value => setMinEngagement(value)}>
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </HStack>
            <Select placeholder="Select comparison type" value={compareType} onChange={e => setCompareType(e.target.value)}>
              <option value="sentiment">Sentiment</option>
              <option value="bias">Bias</option>
            </Select>
            <Select placeholder="Select direction type" value={directionType} onChange={e => setDirectionType(e.target.value)}>
              <option value="<">&lt; (Less than)</option>
              <option value=">">&gt; (Greater than)</option>
            </Select>
            <Button type="submit" colorScheme="blue" w="full">Submit</Button>
          </VStack>
        </form>
        <VStack spacing={4} overflowY="auto" maxHeight="300px" w="full">
          {data.length > 0 ? (
            data.map((item, index) => (
              <Box key={index} p={4} boxShadow="md" borderRadius="md" w="full">
                <Text>FOLLOWERS: {item.followers}</Text>
                <Text>AVG_ENGAGEMENT: {item.avg_engagement}</Text>
              </Box>
            ))
          ) : (
            <Text width="100%" textAlign="center">No data or loading...</Text>
          )}
        </VStack>
      </VStack>
    </Flex>
  );
}

export default HighEngagement;