import { Song } from "@/types";
import {
  SupabaseClient,
  createServerComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

async function getLikedSongs(): Promise<Song[]> {
  const supabase: SupabaseClient<any, "public", any> =
    createServerComponentClient({
      cookies: cookies,
    });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { data } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", session?.user?.id)
    .order("created_at", { ascending: false });

  if (!data) {
    return [];
  }

  return data.map((item: any): any => ({
    ...item.songs,
  }));
}

export default getLikedSongs;
