import React, {useState} from 'react';
import { VStack, HStack, Flex, Spacer, Box, Button } from '@chakra-ui/react'
import { Textarea } from '@chakra-ui/react'

function Influence() {
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
          <h1 className='text-center'>Users With Influence</h1>
          <p className='text-small'>a query to return users with high influence based on a minimum amount of followers</p>
 
        </Box>
      <form onSubmit={handleSubmit}>
        <Box bgSize={400} height={100} width={200}>
        <Textarea
            value={textValue}
            onChange={handleChange}
            placeholder="enter threshold for the minimum followers for high influence users"
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

export default Influence;