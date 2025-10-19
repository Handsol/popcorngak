"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Movie } from "@/types/tmdb";
import {
  fetchNowPlayingMovies,
  getImageUrl,
  formatDate,
  formatVoteAverage,
  TMDBError
} from "@/utils/tmdb";

interface NowPlayingMoviesProps {
  limit?: number;
}

export default function NowPlayingMovies({
  limit = 10
}: NowPlayingMoviesProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchNowPlayingMovies(1);
        const limitedMovies = response.results.slice(0, limit);
        setMovies(limitedMovies);
      } catch (err) {
        if (err instanceof TMDBError) {
          setError(err.message);
        } else {
          setError("영화 정보를 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [limit]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          오류가 발생했습니다
        </h3>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          현재 상영 중인 영화
        </h2>
        <p className="text-gray-600">최신 영화 정보를 확인해보세요</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="relative aspect-[2/3]">
              <Image
                src={getImageUrl(movie.poster_path, "w500")}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/placeholder-movie.svg";
                }}
              />
              <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">
                ⭐ {formatVoteAverage(movie.vote_average)}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                {movie.title}
              </h3>

              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {movie.overview}
              </p>

              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{formatDate(movie.release_date)}</span>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  {movie.original_language.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
