import { useEffect, useState } from "react";

import { client } from "../sanityClient";
import { feedQuery, searchQuery } from "../utils/data";
import { Spinner, MasonryLayout } from "./index";

const Search = ({ searchTerm }) => {
  const [pins, setPins] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (searchTerm !== '') {
      setLoading(true)
      const querySearch = searchQuery(searchTerm.toLowerCase());
      
      client.fetch(querySearch).then((data) => {
        setPins(data)
        setLoading(false)
      })
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data)
        setLoading(false)
      })
    }
  }, [searchTerm])

  return (
    <div>
      {loading && <Spinner message="Searching for pins..." />}
      {pins?.length !== 0 && <MasonryLayout pins={pins} />}
      {pins?.length === 0 && searchTerm !== "" && !loading && (
        <h2 className="mt-10 text-center text-xl">No Pins Found!</h2>
      )}
    </div>
  );
};

export default Search;
