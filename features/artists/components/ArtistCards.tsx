import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

type ArtistCardProps = {
  rank: number;
  name: string;
  imagePath: string;
  views: number;
  hearts: number;
};

export function ArtistCard({
  rank,
  name,
  imagePath,
  views,
  hearts,
}: ArtistCardProps) {
  return (
    <Card className="w-full max-w-[12rem] overflow-hidden p-0 pt-4 px-5 bg-surface border-2 border-muted-fg/30">
      <CardHeader className="relative aspect-square w-full p-0">
        <Image
          src={imagePath}
          alt={`Image of ${name}`}
          fill
          className="object-cover rounded-lg"
        />

        <div className="absolute top-2 left-2 bg-surface font-display text-white text-2xl font-semibold px-2 py-1 rounded-md shadow-md">
          {rank}
        </div>
      </CardHeader>

      <CardContent className="font-display p-0 pb-4">
        <h1 className="text-xl text-center truncate">{name}</h1>
        <Separator className="my-2" />
        <div className="text-xs flex justify-between">
          <p>
            <FontAwesomeIcon icon={faEye} /> {views.toLocaleString()}
          </p>
          <p>
            <FontAwesomeIcon icon={faHeart} /> {hearts.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
