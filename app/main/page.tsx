import { WeddingMain } from "@/components/wedding-main";
import { MusicPlayer } from "@/components/music-player";

export const metadata = {
  title: "Harold & Karen · Our Wedding",
};

export default function MainPage() {
  return (
    <>
      <WeddingMain />
      <MusicPlayer />
    </>
  );
}
