import { useState, useEffect } from 'react';
const Fetch = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetch('https://localhost:3000/api/political-affiliation')
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
      });
  }, []);
  return (
    <div>
      
      {photos.map((photo) => (
        <img key={photo.id} src={photo.url} alt={photo.title} width={100} />
      ))}
    </div>
  );
};
export default Fetch;
