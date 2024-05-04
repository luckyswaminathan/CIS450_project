import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Sentiment from './pages/sentiment/Sentiment';
import User from './pages/users/User';
import Topics from './pages/topics/Topics';
import Influence from './pages/users/Influence';
import PoliticalAffiliation from './pages/topics/PoliticalAffiliation';
import StateAffiliation from './pages/topics/StateAffiliation';
import UserEngagement from './pages/engagement/UserEngagement';
import SentimentOverTime from './pages/sentiment/SentimentOverTime';
import SentimentByState from './pages/sentiment/SentimentByState';
import PoliticianComparison from './pages/engagement/PoliticanComparison';
import PoliticalKeywords from './pages/topics/PoliticalKeywords';

function App() {
  const [color, changeColor] = useState('#E6E6FA')
  return (
    <div style={{backgroundColor: color}}>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        // sentiment home page
        <Route path="/sentiment" element={<Sentiment />} />
        // user home page
        <Route path="/user" element={<User />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="*" element={<NotFound />} />

        // */ route 1 */
        <Route path="/user/influence" element={<Influence />} />
        
        // */ route 2 */
        <Route path="/sentiment/political-affiliation" element={<PoliticalAffiliation />} />
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
        <Route path="/topics/political-affiliation" element={<PoliticalKeywords />} />
        // route 9
        <Route path="/users/positive-high-engagement" element={<Sentiment />} />
        // route 10
        <Route path="/users/sentiment-transition" element={<Sentiment />} />
      </Routes>
    </Router>
    </div>
  );

}

export default App;
