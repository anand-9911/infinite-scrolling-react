import axios from 'axios';
import {useEffect, useState} from 'react';

export default function useBookSearch(query, pageNumber) {
  let cancel;
  const [loading, setloading] = useState(true);
  const [error, seterror] = useState(false);
  const [books, setbooks] = useState([]);
  const [hasMore, sethasMore] = useState(false);

  useEffect(() => {
    setbooks([]);
  }, [query]);

  useEffect(() => {
    setloading(true);
    seterror(false);
    axios({
      method: 'GET',
      url: 'http://openlibrary.org/search.json',
      params: {q: query, page: pageNumber},
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((response) => {
        setbooks((prevBooks) => {
          return [
            ...new Set([
              ...prevBooks,
              ...response.data.docs.map((book) => book.title),
            ]),
          ];
        });
        sethasMore(response.data.docs.length > 0);
        setloading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        seterror(true);
      });
    return () => cancel();
  }, [query, pageNumber]);
  return {
    loading,
    error,
    books,
    hasMore,
  };
}
