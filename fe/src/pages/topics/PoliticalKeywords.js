import React, { useState } from 'react';
import { VStack, Box, Button, Text, Textarea, useToast } from '@chakra-ui/react';

function PoliticalKeywords() {
  const [data, setData] = useState([]);
  const [limit, setLimit] = useState('');
  const [politicalAffiliation, setPoliticalAffiliation] = useState('');
  const [minimumCount, setMinimumCount] = useState('');
  const [field, setField] = useState('');
  const [error, setError] = useState('');
  const toast = useToast();

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePoliticalAffiliationChange = (event) => {
    setPoliticalAffiliation(event.target.value);
  };

  const handleMinimumCountChange = (event) => {
    setMinimumCount(event.target.value);
  };

  const handleFieldChange = (event) => {
    setField(event.target.value);
  };

  const validateInputs = () => {
    if (!['Democrat', 'Republican'].includes(politicalAffiliation)) {
      return "Please enter a valid political affiliation (Democrat or Republican).";
    }
    if (isNaN(limit) || limit <= 0) {
      return "Limit must be a positive number.";
    }
    if (isNaN(minimumCount) || minimumCount <= 0) {
      return "Minimum count must be a positive number.";
    }
    if (!['keywords', 'hashtags'].includes(field.toLowerCase())) {
      return "Field must be either 'keywords' or 'hashtags'.";
    }
    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errorMessage = validateInputs();
    if (errorMessage) {
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const url = `http://localhost:3001/api/state-keywords?limit=${limit}&political_affiliation=${politicalAffiliation}&minimum_count=${minimumCount}&field=${field}`;
    console.log("Fetching data from:", url);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
      setData(jsonData);
      console.log("Data updated:", jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Fetching Error",
        description: `Error fetching data: ${error.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <VStack spacing={4}>
      <Box>
        <h1 className='text-center'>Political Keywords Analysis</h1>
        <p className='text-small'>Identify significant political keywords or hashtags from tweets</p>
      </Box>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Textarea
            value={limit}
            onChange={handleLimitChange}
            placeholder="Enter the limit for keywords per state"
          />
          <Textarea
            value={politicalAffiliation}
            onChange={handlePoliticalAffiliationChange}
            placeholder="Enter political affiliation (Democrat or Republican)"
          />
          <Textarea
            value={minimumCount}
            onChange={handleMinimumCountChange}
            placeholder="Enter the minimum count of mentions for inclusion"
          />
          <Textarea
            value={field}
            onChange={handleFieldChange}
            placeholder="Enter field (keywords or hashtags)"
          />
          <Button type="submit" colorScheme="blue">Submit</Button>
        </VStack>
      </form>
      {data.length > 0 && (
        <VStack spacing={4}>
          {data.map((item, index) => (
            <Box key={index}>
              <Text>
                STATE: {item._id},
                KEYWORDS: {item.keywords.join(', ')}
              </Text>
            </Box>
          ))}
        </VStack>
      )}
      {data.length === 0 && (
        <Text>No data or loading...</Text>
      )}
    </VStack>
  );
}

export default PoliticalKeywords;