import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function SentimentOverTime() {
  const [textValue, setTextValue] = useState('');

  const handleChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSubmit = () => {
    
    console.log("Submitted value:", textValue);
  };

  const [end, setEnd] = useState('');
  const handleStateChange = (event) => {
    setEnd(event.target.value);
  }
  const handleStateSubmit = () => {
    console.log("Submitted state:", end);
  }

  return (
    <Flex >

        <Spacer />
        <VStack spacing={100}>
        <Box>
          <h1 className='text-center'>Sentiment Over Time</h1>
          <p className='text-small'>a query to identify how sentiment has changed over time for different topics</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={20}>
        <Box bgSize={100}>
        <Textarea
            value={textValue}
            onChange={handleChange}
            placeholder="enter start date"
            onSubmit={handleSubmit}
          />
        </Box>
        <Box bgSize={100}>
        <Textarea
            value={end}
            onChange={handleStateChange}
            placeholder="enter end date"
            onSubmit={handleStateSubmit}
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

export default SentimentOverTime;