import { supabase } from "./SupabaseClient";

// 로그인한 유저 ID 얻기
export async function getUid() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

// 북마크
export async function addBookmark(tmdbId: number) {
  const uid = await getUid();
  if (!uid) throw new Error("로그인이 필요함");
  return supabase.from("bookmarks").upsert({ user_id: uid, tmdb_id: tmdbId });
}
export async function removeBookmark(tmdbId: number) {
  const uid = await getUid();
  if (!uid) throw new Error("로그인이 필요함");
  return supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", uid)
    .eq("tmdb_id", tmdbId);
}
export async function getMyBookmarks() {
  const uid = await getUid();
  if (!uid) return [];
  const { data } = await supabase
    .from("bookmarks")
    .select("tmdb_id")
    .eq("user_id", uid);
  return data ?? [];
}

// 별점
export async function setRating(tmdbId: number, rating: number) {
  const uid = await getUid();
  if (!uid) throw new Error("로그인이 필요함");
  return supabase
    .from("ratings")
    .upsert({ user_id: uid, tmdb_id: tmdbId, rating });
}
export async function getMyRating(tmdbId: number) {
  const uid = await getUid();
  if (!uid) return null;
  const { data } = await supabase
    .from("ratings")
    .select("rating")
    .eq("user_id", uid)
    .eq("tmdb_id", tmdbId)
    .maybeSingle();
  return data?.rating ?? null;
}
