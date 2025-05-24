import React from 'react';
import WikipediaSummary from './WikipediaSummary';

const App = () => {
  const [wikipediaSummary, setWikipediaSummary] = React.useState(null);

  // Assume fetchData is a function that fetches data from an API
  React.useEffect(() => {
    const fetchData = async () => {
      const result = await fetch('https://api.example.com/summary');
      const data = await result.json();
      setWikipediaSummary(data);
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Wikipedia Summary Viewer</h1>
      {wikipediaSummary && (
        <div className="mt-8">
          <WikipediaSummary summary={wikipediaSummary} />
        </div>
      )}
    </div>
  );
};

export default App;