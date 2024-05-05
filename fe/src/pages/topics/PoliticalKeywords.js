import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function PoliticalKeywords() {
  const [textValue, setTextValue] = useState('');

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
          <h1 className='text-center'>Political Keywords By State</h1>
          <p className='text-small'>a query to identify keywords used by tweets from each party in each state</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <Box bgSize={100}>
        <Textarea
            value={textValue}
            onChange={handleChange}
            placeholder="enter a state"
            onSubmit={handleSubmit}
          />
        </Box>
        <Button type="submit" colorScheme="blue">Submit</Button>
      </form>
        </VStack>
        <Spacer />
        
      </Flex>
  );
}

export default PoliticalKeywords;