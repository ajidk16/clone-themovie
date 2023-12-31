import moment from "moment";
import { Fragment, useState } from "react";
import {
  BsFillBookmarkFill,
  BsFillPlayFill,
  BsFillStarFill,
  BsHeartFill,
} from "react-icons/bs";
import { TfiMenuAlt } from "react-icons/tfi";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { CardMovie } from "../../../components";
import ProgressCircle from "../../../components/Card/ProgressCircle";
import Loading from "../../../components/Loading";
import {
  getCredits,
  getDetailMovie,
  getKeywords,
  getRecomendations,
  getReviews,
} from "../../../feature/movie/action";
import MainLayout from "../../../components/Layouts";

const icons = [
  {
    icon: <TfiMenuAlt className="text-sm" />,
  },
  {
    icon: <BsHeartFill className="text-sm" />,
  },
  {
    icon: <BsFillBookmarkFill className="text-sm" />,
  },
  {
    icon: <BsFillStarFill className="text-sm" />,
  },
];

function convertToRupiah(number: number) {
  const rupiah = `${number?.toFixed(2)?.replace(/\d(?=(\d{3})+\.)/g, "$&,")}`;
  return rupiah;
}

const Detail = () => {
  const { movie_id } = useParams();
  const dispatch = useAppDispatch();
  const { detailMovie, cast, reviews, recomendations, keywords } =
    useAppSelector((state) => state.movie);

  const dSocial = [
    {
      title: `review (${reviews?.length})`,
      desc: (
        <main>
          {reviews?.map((item, idx) => {
            if (idx === 1) {
              return (
                <section
                  className="flex flex-col md:flex-row gap-4 items-center md:items-start"
                  key={`review1-${idx}`}
                >
                  <img
                    src={`https://www.themoviedb.org/t/p/w128_and_h128_face${item.author_details.avatar_path}`}
                    alt=""
                    className="w-16 h-16 rounded-full object-cover border"
                  />

                  <div>
                    <div>
                      <a href="#" className="font-bold">
                        A review by {item.author}
                      </a>
                      <p className="text-sm font-light">
                        Written by{" "}
                        <span className="font-medium">{item.author}</span> on{" "}
                        {moment(item.updated_at).format("MMMM YYYY")}
                      </p>
                    </div>
                    <p className="text-sm font-normal mt-2 line-clamp-5">
                      {item.content}
                    </p>
                  </div>
                </section>
              );
            }
          })}
        </main>
      ),
    },
    {
      title: "discussions",
      desc: "Want to be notified when someone makes the first post? Yes, notify me!",
    },
  ];

  const [social, setSocial] = useState(0);
  const movie = movie_id?.split("-").find((_item, idx) => idx === 0);

  const { isLoading } = useQuery("detail-movie", () => {
    dispatch(getDetailMovie({ movie_id: String(movie) }));
    dispatch(getCredits({ movie_id: String(movie_id) }));
    dispatch(getReviews({ movie_id: String(movie_id) }));
    dispatch(getKeywords({ movie_id: String(movie_id) }));
    dispatch(getRecomendations({ movie_id: String(movie_id) }));
  });

  const duration = moment.duration(detailMovie?.runtime, "minutes");
  const hours = Math.floor(duration.asHours());
  const minutes = duration.minutes();

  // console.log("kredit", detailMovie);

  return (
    <MainLayout>
      <main>
        {isLoading ? (
          <Loading />
        ) : (
          <Fragment>
            <section
              className={`border-b border-solid w-full relative  bg-cover bg-no-repeat bg-customLeft text-white`}
              style={{
                backgroundImage: `url('https://image.tmdb.org/t/p/original${detailMovie?.backdrop_path}')`,
              }}
            >
              <div className="w-full mx-auto bg-customprimary">
                <div className="container p-5 md:px-20 md:py-10 mx-auto max-w-[1440px] flex items-center flex-col md:flex-row gap-8">
                  <div>
                    <img
                      src={`https://image.tmdb.org/t/p/original${detailMovie?.poster_path}`}
                      alt={detailMovie?.title}
                      className="min-w-[300px] h-[450px] rounded-lg"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-bold text-3xl text-white">
                      <Link to={"/"}>{detailMovie?.title}</Link>{" "}
                      <span className="font-light">
                        ( {moment(detailMovie?.release_date).format("YYYY")} )
                      </span>
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-white font-light">
                      {moment(detailMovie?.release_date).format(
                        "MMMM DD, YYYY"
                      )}{" "}
                      <div className="w-1 h-1 rounded-full bg-white" />
                      {detailMovie?.genres?.map((item, idx) => (
                        <span key={`genres-${idx}`}>
                          {item.name}
                          {idx === detailMovie?.genres?.length - 1 ? "" : ", "}
                        </span>
                      ))}
                      <div className="w-1 h-1 rounded-full bg-white" />
                      {` ${hours}h ${minutes}m`}
                    </div>
                    <div className="my-4 flex flex-wrap items-center gap-4">
                      <ProgressCircle
                        vote_average={String(
                          detailMovie?.vote_average?.toFixed(1)
                        )}
                      />
                      <div className="capitalize text-white">
                        <h4>user</h4> <h4>score</h4>
                      </div>
                      <div className="flex flex-wrap gap-x-5 ml-4 items-center">
                        {icons.map((item, idx) => (
                          <div
                            className="bg-blue rounded-full p-4 flex justify-center items-center cursor-pointer"
                            key={`icon-${idx}`}
                          >
                            {item.icon}
                          </div>
                        ))}
                        <span className="flex gap-x-2 items-center">
                          <BsFillPlayFill className="text-xl" />
                          play trailer
                        </span>
                      </div>
                    </div>
                    <div className="italic">{detailMovie?.tagline}</div>
                    <div className="text-white">
                      <div className="text-lg font-bold">Overview</div>
                      <div className="text-sm">{detailMovie?.overview}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="p-5 md:px-20 md:py-8 mx-auto max-w-[1440px] gap-10 grid grid-cols-1 md:grid-cols-12">
              <div className="col-span-9">
                <h3 className="capitalize text-2xl font-semibold">
                  top bill cast
                </h3>
                <div className="flex justify-start content-start items-center pb-5 gap-x-5">
                  <div className="flex gap-4 overflow-scroll">
                    {cast?.slice(0, 20)?.map((item, idx) => (
                      <div
                        className="min-w-[150px] max-w-[150px]"
                        key={`bill-top-${idx}`}
                      >
                        <CardMovie
                          poster_path={`https://www.themoviedb.org/t/p/w276_and_h350_face/${item.profile_path}`}
                          release_date={item.character}
                          title={item.name}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button className="capitalize text-gray-400">
                  Full Cast & Crew
                </button>
                <div className="flex justify-start items-start gap-x-8 mt-5">
                  <h4 className="font-semibold text-lg capitalize">social</h4>
                  <div className="flex gap-x-4 items-center">
                    {dSocial.map((item, idx) => (
                      <h4
                        className={`font-medium text-base capitalize ${
                          idx === social
                            ? "border-b-2 border-b-black cursor-no-drop"
                            : "cursor-pointer"
                        } pb-2`}
                        key={`dsocial-${idx}`}
                        onClick={() => setSocial(idx)}
                      >
                        {item.title}
                      </h4>
                    ))}
                  </div>
                </div>
                {dSocial.map(
                  (item, idx) =>
                    idx === social && (
                      <div key={`desc-social-${idx}`} className="mt-3">
                        {item.desc}
                      </div>
                    )
                )}
                <h3 className="capitalize text-gray-400 mt-4 cursor-pointer">
                  go to discussions
                </h3>

                <h3 className="capitalize text-2xl font-semibold mt-5">
                  recomendations
                </h3>

                <div className="flex justify-start content-start items-center gap-x-5">
                  <div className="flex gap-x-5  overflow-scroll relative">
                    {recomendations?.map((item, idx) => (
                      <div
                        className="min-w-[256px] max-w-[256px] mt-3"
                        key={`recomendations-${idx}`}
                      >
                        <img
                          src={`https://www.themoviedb.org/t/p/w500_and_h282_face/${item.backdrop_path}`}
                          alt={item.title}
                          className="object-cover"
                        />
                        <div className="flex justify-between items-center mt-2">
                          <h5 className="truncate">{item.title}</h5>
                          <div>{parseFloat(item.vote_average).toFixed(1)}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-3 flex flex-col gap-y-5">
                <div>
                  <h5 className="capitalize font-semibold">Status</h5>
                  <p>{detailMovie?.status}</p>
                </div>
                <div>
                  <h5 className="capitalize font-semibold">
                    Original Language
                  </h5>
                  <p>{detailMovie?.original_language}</p>
                </div>
                <div>
                  <h5 className="capitalize font-semibold">Budget</h5>
                  <p>${convertToRupiah(Number(detailMovie?.budget))}</p>
                </div>
                <div>
                  <h5 className="capitalize font-semibold">Revenue</h5>
                  <p>${convertToRupiah(Number(detailMovie?.revenue))}</p>
                </div>
                <div>
                  <h5 className="capitalize font-semibold">Keywords</h5>
                  <p className="flex flex-wrap gap-2 mt-2">
                    {keywords?.map((item, idx) => (
                      <span
                        className="bg-gray-300 rounded-lg text-sm px-4 py-1"
                        key={`keywords-${idx}`}
                      >
                        {item.name}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </section>
          </Fragment>
        )}
      </main>
    </MainLayout>
  );
};

export default Detail;
