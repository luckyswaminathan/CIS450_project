import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function PoliticalAffiliation() {
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
          <h1 className='text-center'>Political Affiliation Sentiment</h1>
          <p className='text-small'>Aggregated sentiments of each political affiliation</p>
 
        </Box>
        <Button type="submit" colorScheme="blue">Search</Button>
        </VStack>
        <Spacer />
        
      </Flex>
  );
}

export default PoliticalAffiliation;