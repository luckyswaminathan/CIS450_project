import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button, Text} from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function UserEngagement() {

  const [data, setData] = useState([]);
  const [minValue, setMinValue] = useState(-1.0);
  const [refreshKey, setRefreshKey] = useState(0);
 
  const handleChange = (event) => {
    setMinValue(event.target.value);
  };


  const [maxValue, setMaxValue] = useState(1.0);
  const handleMaxChange = (event) => {
    setMaxValue(event.target.value);
  }

  const handleSubmit = () => {
    console.log("Submit button clicked!");
    const url = `http://localhost:3000/api/user-engagement?min_sentiment=${minValue}&max_sentiment=${maxValue}`;
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        console.log("Data updated:", data);
      })
      .catch((error) => console.error(error));
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
        <Textarea
            value={minValue}
            onChange={handleChange}
            placeholder="enter min sentiment value"
          />

        </Box>
        <Box bgSize={100}>
          <p>Max: </p>
        <Textarea
            value={maxValue}
            onChange={handleMaxChange}
            placeholder="enter max sentiment value"
          />
        </Box>
        <Button type="submit" colorScheme="blue">Submit</Button>
        </VStack>
      </form>

      {data.length > 0 && (
          <VStack spacing={4} key={refreshKey}> // Add the refresh key prop here
            {data.map((item) => (
              <Box key={item.USER_ID}>
                <Text>
                  User ID: {item.USER_ID}
                  Avg Likes: {item.AVG_LIKES}
                  Avg Retweets: {item.AVG_RETWEETS}
                  Avg Sentiment: {item.AVG_SENTIMENT}
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