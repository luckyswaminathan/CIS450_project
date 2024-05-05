import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button, Text } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function PoliticalAffiliation() {
  const [data, setData] = useState('');


  const [refreshKey, setRefreshKey] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submit button clicked!");
    const url = `http://localhost:3001/api/sentiment/political-affiliation`;
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
          <h1 className='text-center'>Political Affiliation Sentiment</h1>
          <p className='text-small'>Aggregated sentiments of each political affiliation</p>
 
        </Box>
        <form onSubmit={handleSubmit}>
        
        <Button type="submit" colorScheme="blue">Search</Button>
      </form>

      {data.length > 0 && (
          <VStack spacing={4} key={refreshKey}>
            {data.map((item) => (
              <Box key={item.SENTIMENT_COUNT}>
                <Text>
                  POLITICAL_AFFILIATION: {item.POLITICAL_AFFILIATION === "" ? "NONE" : item.POLITICAL_AFFILIATION},
                  SENTIMENT_CATEGORY : {item.SENTIMENT_CATEGORY}, 
                  SENTIMENT_COUNT: {item.SENTIMENT_COUNT}
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

export default PoliticalAffiliation;