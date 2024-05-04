import React from 'react';
import './Home.css'

import UserBar from './components/UserBar.js'
import SentimentBar from './components/SentimentBar.js';
import EngagementBar from './components/EngagementBar.js';
import TopicsBar from './components/TopicsBar.js';
import { VStack, HStack, Flex, Spacer, Box } from '@chakra-ui/react'
import bidentrump from './assets/bidentrump.jpeg'


function Home() {
  return (
    <div>

      <Flex >

        <Spacer />
        <Box>
          <h1 className='text-center'>Welcome to EleXion</h1>
          <p className='text-small'>our center for analysis of tweets on X(formerly twitter) during 2020</p>
          <p className='text-small'>hover over a category to get started!</p>
        </Box>
        <Spacer />
        
      </Flex>
      <VStack spacing={100}>
      <HStack paddingTop='100px' spacing="100px" justifyContent="center">
        <UserBar />
        <SentimentBar />
        <EngagementBar/>
        <TopicsBar/>

      </HStack>
      <a>
        <img src={bidentrump} alt="Biden Trump" width={500} />
      </a>
      
      </VStack>

    </div>
    

    
  );
}

export default Home;