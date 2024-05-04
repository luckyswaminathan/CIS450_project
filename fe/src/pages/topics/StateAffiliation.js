import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function StateAffiliation() {
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
          <h1 className='text-center'>Topics Discussed by State Affiliation</h1>
          <p className='text-small'>a query to identify topics talked about most per state</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <Box bgSize={100}>
        <Textarea
            value={textValue}
            onChange={handleChange}
            placeholder="enter a limit for topics, default is 10"
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

export default StateAffiliation;