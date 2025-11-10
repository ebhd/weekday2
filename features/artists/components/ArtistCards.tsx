import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export function ArtistCard() {
  return (
    <Card className="w-full max-w-[12rem] overflow-hidden p-0 pt-4 px-5 bg-surface border-2 border-muted-fg/30">
      <CardHeader className="relative aspect-square w-full p-0">
        <Image
          src="/Charlie Wilson.avif"
          alt="Image of the artist"
          fill
          className="object-cover rounded-lg"
        />

        <div className="absolute top-2 left-2 bg-surface font-display text-white text-2xl font-semibold px-2 py-1 rounded-md shadow-md">
          1
        </div>
      </CardHeader>

      <CardContent className="font-display p-0 pb-4">
        <h1 className="text-xl text-center truncate">Charlie Wilson</h1>
        <Separator className="my-2" />
        <div className="text-xs flex justify-between">
          <p>
            <FontAwesomeIcon icon={faEye} /> 100k
          </p>
          <p>
            <FontAwesomeIcon icon={faHeart} /> 10k
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
