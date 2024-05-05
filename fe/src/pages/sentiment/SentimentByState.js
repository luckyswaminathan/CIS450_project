import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function SentimentByState() {
  const [textValue, setTextValue] = useState('');
  const [state, setState] = useState('');
  const handleStateChange = (event) => {
    setState(event.target.value);
  }
  const handleStateSubmit = () => {
    console.log("Submitted state:", state);
  }

  const handleChange = (event) => {
    setTextValue(event.target.value);
  };

  const handleSubmit = () => {
    
    console.log("Submitted value:", textValue);
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
        <VStack spacing={100}>
        <Box bgSize={100}>
        <Textarea
            value={textValue}
            onChange={handleChange}
            placeholder="state abbreviation(eg. CA) as state"
            onSubmit={handleSubmit}
          />
        </Box>

        <Box bgSize={100}>
        <Textarea
            value={state}
            onChange={handleStateChange}
            placeholder="enter topic(optional)"
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

export default SentimentByState;