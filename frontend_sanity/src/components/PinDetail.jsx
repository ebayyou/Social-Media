import { useEffect, useState } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../sanityClient";
import { pinDetailMorePinQuery, pinDetailQuery } from "../utils/data";
import { Spinner, MasonryLayout } from "./index";

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState(null);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);

  const fetchPinDetails = () => {
    const query = pinDetailQuery(pinId);

    client.fetch(query).then((data) => {
      setPinDetail(data[0]);

      if (data[0]) {
        const moreQuery = pinDetailMorePinQuery(pinId);

        client.fetch(moreQuery).then((data) => setPins(data));
      }
    });
  };

  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment("");
          setAddingComment(false);
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) return <Spinner message="Loading Pin..." />;

  return (
    <>
      <div
        className="flex xl:flex-row flex-col m-auto bg-white"
        style={{ maxWidth: "1500px", borderRadius: "32px" }}
      >
        <div className="flex justify-center items-center md:items-start flex-initial">
          <img
            src={pinDetail?.image && urlFor(pinDetail.image).url()}
            alt={pinDetail.title}
            className="rounded-t-3xl rounded-b-lg max-w-full"
          />
        </div>

        <div className="w-full p-5 flex-1 xl:min-w-620">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetail?.image.asset.url}?dl=`}
                download
                className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
              >
                <MdDownloadForOffline />
              </a>
            </div>

            <a href={pinDetail?.destination} target="_blank" rel="noreferrer">
              {pinDetail.destination?.slice(8)}
            </a>
          </div>

          <div>
            <h1 className="text-4xl font-bold break-words mt-3">
              {pinDetail.title}
            </h1>

            <p className="mt-3">{pinDetail.about}</p>

            <Link
              to={`/user-profile/${pinDetail?.postedBy._id}`}
              className="flex gap-2 mt-5 items-center bg-white rounded-lg"
            >
              <img
                src={pinDetail?.postedBy.image}
                className="w-10 h-10 rounded-full"
                alt={pinDetail?.postedBy.username}
              />
              <p className="font-bold">
                {pinDetail?.postedBy.username || "someone"}
              </p>
            </Link>

            <h2 className="mt-5 text-2xl">Comments</h2>

            <div className="max-h-370 overflow-y-auto">
              {pinDetail?.comments?.map((item) => (
                <div
                  key={item.comment}
                  className="flex gap-2 mt-5 items-center bg-white rounded-lg"
                >
                  <img
                    src={item.postedBy.image}
                    alt={item.postedBy.userName}
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold">{item.postedBy.userName}</p>
                    <p>{item.comment}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user._id}`}>
                <img
                  src={user.image}
                  className="w-10 h-10 rounded-full cursor-pointer"
                  alt="user-profile"
                />
              </Link>

              <input
                type="text"
                className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
                placeholder="Add a comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                type="button"
                className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-violet-400"
                onClick={addComment}
              >
                {addingComment ? "Doing..." : "Done"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {pins?.length > 0 && (
        <h2 className="text-center font-bold text-2xl mt-8 mb-4">
          More Like this
        </h2>
      )}

      {pins ? (
        <MasonryLayout pins={pins} />
      ) : (
        <Spinner message="Loading more pins..." />
      )}
    </>
  );
};

export default PinDetail;
