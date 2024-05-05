import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

import Influence from './pages/users/Influence';
import PoliticalAffiliation from './pages/topics/PoliticalAffiliation';
import StateAffiliation from './pages/topics/StateAffiliation';
import UserEngagement from './pages/engagement/UserEngagement';
import SentimentOverTime from './pages/sentiment/SentimentOverTime';
import SentimentByState from './pages/sentiment/SentimentByState';
import PoliticianComparison from './pages/engagement/PoliticanComparison';
import PoliticalKeywords from './pages/topics/PoliticalKeywords';
import SentimentTransition from './pages/users/SentimentTransition';
import HighEngagement from './pages/users/HighEngagement';


import { ChakraProvider } from '@chakra-ui/react'

import { accordionTheme } from './theme';
function App() {
  const [color, changeColor] = useState('#E6E6FA')
  return (
    <ChakraProvider theme={accordionTheme}>

    <Router>
      <header style={{ padding: '10px 20px', backgroundColor: '#f0f0f0', textAlign: 'center' }}>
          <Link to="/" style={{ marginRight: '20px' }}>Home</Link>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        // sentiment home page

        <Route path="*" element={<NotFound />} />
        // */ route 1 */
        <Route path="/users/influence" element={<Influence />} />
        // */ route 2 */
        <Route path="/topics/political-affiliation" element={<PoliticalAffiliation />} />
        // */ route 3 */
        <Route path="/topics/state-affiliation" element={<StateAffiliation />} />
        // route 4
        <Route path="/engagement/user-engagement" element={<UserEngagement />} />
        // route 5
        <Route path="/sentiment/time" element={<SentimentOverTime />} />
        // route 6
        <Route path="/sentiment/state" element={<SentimentByState />} />
        //route 7
        <Route path="/engagement/politican-comparison" element={<PoliticianComparison />} />
        // route 8
        <Route path="/topics/political-keywords" element={<PoliticalKeywords />} />
        // route 9
        <Route path="/users/positive-high-engagement" element={<HighEngagement />} />
        // route 10
        <Route path="/users/sentiment-transition" element={<SentimentTransition />} />

      </Routes>
    </Router>
    </ChakraProvider>
  );

}

export default App;
