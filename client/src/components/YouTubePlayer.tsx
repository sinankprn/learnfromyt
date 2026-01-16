export default function YouTubePlayer({
  videoId,
  width = 560,
  height = 315,
}: {
  videoId: string;
  width?: number;
  height?: number;
}) {
  const src = `https://www.youtube.com/embed/${videoId}`;
  return (
    <iframe
      width={width}
      height={height}
      src={src}
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
    ></iframe>
  );
}
