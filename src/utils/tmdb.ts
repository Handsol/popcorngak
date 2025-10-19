import { Movie, NowPlayingResponse } from "@/types/tmdb";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export class TMDBError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "TMDBError";
  }
}

export async function fetchNowPlayingMovies(
  page: number = 1
): Promise<NowPlayingResponse> {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;

  if (!apiKey) {
    throw new TMDBError(
      "TMDB API 키가 설정되지 않았습니다. .env.local 파일에 NEXT_PUBLIC_TMDB_API_KEY를 설정해주세요."
    );
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${apiKey}&page=${page}&language=ko-KR`,
      {
        next: { revalidate: 3600 } // 1시간 캐시
      }
    );

    if (!response.ok) {
      throw new TMDBError(
        `TMDB API 요청 실패: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof TMDBError) {
      throw error;
    }
    throw new TMDBError(
      `네트워크 오류: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
}

export function getImageUrl(
  path: string | null,
  size: "w200" | "w300" | "w500" | "original" = "w500"
): string {
  if (!path) {
    return "/placeholder-movie.svg"; // 기본 이미지 경로
  }
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function formatVoteAverage(voteAverage: number): string {
  return voteAverage.toFixed(1);
}
