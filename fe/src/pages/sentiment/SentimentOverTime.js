import React, { useState } from 'react';
import { VStack, Flex, Spacer, Box, Button, Textarea, Text } from '@chakra-ui/react'

function SentimentOverTime() {
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');  // To hold start date
  const [endDate, setEndDate] = useState('');  // To hold end date

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
  };

  const handleEndDateChange = (event) => {
    console.log("End date:", event);
    setEndDate(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    const url = `http://localhost:3001/api/sentiment/time?from_date=${startDate}&to_date=${endDate}`;
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
    <Flex direction="column" align="center" justify="center">
      <VStack spacing={10}>
        <Box>
          <h1 className='text-center'>Sentiment Over Time</h1>
          <p className='text-small'>Query how sentiment has changed over time for various topics</p>
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack spacing={10}>
          <Box bgSize={100}>
            <input
              type="date"
              value={startDate}
              onChange={handleStartDateChange}
              placeholder="Start date"
            />
          </Box>
          <Box bgSize={100}>
            <input
              type="date"
              value={endDate}
              onChange={handleEndDateChange}
              placeholder="End date"
            />
          </Box>
            <Button type="submit" colorScheme="blue">Submit</Button>
          </VStack>
        </form>
        {data.length > 0 ? (
          <VStack spacing={4}>
            {data.map((item, index) => (
              <Box key={index}>
                <Flex>
                  <Text>
                    Topic: {item.TOPIC},
                    Month: {item.TWEET_MONTH},
                    Sentiment: {item.SENTIMENT_CATEGORY},
                    Count: {item.SENTIMENT_COUNT}
                  </Text>
                </Flex>
              </Box>
            ))}
          </VStack>
        ) : (
          <Text>No data found or loading...</Text>
        )}
      </VStack>
      <Spacer />
    </Flex>
  );
}

export default SentimentOverTime;
