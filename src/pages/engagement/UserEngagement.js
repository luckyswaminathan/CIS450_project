import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function HighEngagement() {
  const [minValue, setMinValue] = useState('');

  const handleChange = (event) => {
    setMinValue(event.target.value);
  };

  const handleSubmit = () => {
    
    console.log("Submitted value:", minValue);
  };

  const [maxValue, setMaxValue] = useState('');
  const handleMaxChange = (event) => {
    setMaxValue(event.target.value);
  }
  const handleMaxSubmit = () => {
    console.log("Submitted value:", maxValue);
  }


  return (
    <Flex >

        <Spacer />
        <VStack spacing={100}>
        <Box>
          <h1 className='text-center'>User Engagement and Sentiment Analysis</h1>
          <p className='text-small'>Returns correlation between user engagement and sentiment</p>
 
        </Box>
      
      <form onSubmit={handleSubmit}>
        <VStack spacing={100}>
        <Box bgSize={100}>
        <Textarea
            value={minValue}
            onChange={handleChange}
            placeholder="enter min sentiment value"
            onSubmit={handleSubmit}
          />
        </Box>
        <Box bgSize={100}>
        <Textarea
            value={maxValue}
            onChange={handleMaxChange}
            placeholder="enter max sentiment value"
            onSubmit={handleMaxSubmit}
          />
        </Box>
        <Button type="submit" colorScheme="blue">Submit</Button>
        </VStack>
      </form>
        </VStack>
        <Spacer />
        
      </Flex>
  );
}

export default HighEngagement;