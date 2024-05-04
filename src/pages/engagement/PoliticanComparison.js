import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function PoliticianComparison() {
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
          <h1 className='text-center'>Politician Comparison</h1>
          <p className='text-small'>a query to compare engagement of politicans vs non-politicians</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        
        <Button type="submit" colorScheme="blue">Search</Button>
      </form>
        </VStack>
        <Spacer />
        
      </Flex>
  );
}

export default PoliticianComparison;