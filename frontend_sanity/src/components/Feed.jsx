import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { client } from '../sanityClient';
import { feedQuery, searchQuery } from '../utils/data';
import { MasonryLayout, Spinner } from '.';

const Feed = () => {
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState()
  const {categoryId} = useParams();

  useEffect(() => {
    setLoading(true)

    if (categoryId) {
      // const query = searchQuery(categoryId)

      // client.fetch(query)
      //   .then((data) => {
      //     setPins(data)
      //     setLoading(false)
      //   })
    } else { 
      // client.fetch(feedQuery) 
      //   .then((data) => {
      //     setPins(data)
      //     setLoading(false)
      //   })
    }
  }, [categoryId]) 

  if (loading) {
    // return <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
  }

  return (
    <div>
      <h1>Feed</h1>
    </div>
  );
}

export default Feed;