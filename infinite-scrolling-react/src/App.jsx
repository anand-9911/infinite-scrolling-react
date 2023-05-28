import React from 'react';
import {useState, useRef, useCallback} from 'react';
import useBookSearch from './useBookSearch';

function App() {
  const [query, setQuery] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const {loading, hasMore, error, books} = useBookSearch(query, pageNumber);
  const observer = useRef();
  const lastBookElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setPageNumber(1);
  };

  return (
    <>
      <input type="text" onChange={handleSearch} value={query}></input>
      {books.map((book, index) => {
        if (books.length === index + 1) {
          return (
            <div ref={lastBookElementRef} key={book}>
              {book}
            </div>
          );
        }
        return <div key={book}>{book}</div>;
      })}
      {loading && <div>Loading....</div>}
      {error && <div>Error</div>}
    </>
  );
}

export default App;
