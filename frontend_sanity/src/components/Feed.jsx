import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { client } from "../sanityClient";
import { feedQuery, searchQuery } from "../utils/data";
import { MasonryLayout, Spinner } from "./index";

const Feed = () => {
  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState();
  const { categoryId } = useParams();

  useEffect(() => {
    setLoading(true);

    if (categoryId) {
      const query = searchQuery(categoryId);

      client.fetch(query).then((data) => {
        setPins(data);
        setLoading(false);
      });
    } else {
      client.fetch(feedQuery).then((data) => {
        setPins(data);
        setLoading(false);
      });
    }
  }, [categoryId]);

  const ideaName = categoryId || "new";

  if (loading) {
    return (
      <Spinner message={`We are adding ${ideaName} ideas to your feed!`} />
    );
  }

  if (!pins?.length)
    return (
      <h2 className="flex justify-center font-bold items-center w-full text-1xl mt-2">
        No Pins Available!
      </h2>
    );

  return <div>{pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
