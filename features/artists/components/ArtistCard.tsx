import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faHeart } from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { ArtistCardProps } from "../types";
import Link from "next/link";
export function ArtistCard(props: ArtistCardProps) {
  return (
    <Card className="w-full max-w-[12rem] overflow-hidden p-0 pt-4 px-5 bg-surface border-2 border-muted-fg/30">
      <CardHeader className="relative aspect-square w-full p-0">
        <Image
          src={props.imagePath}
          alt={`Image of ${props.name}`}
          fill
          className="object-cover rounded-lg"
        />

        <div className="absolute top-2 left-2 bg-surface font-display text-white text-2xl font-semibold px-2 py-1 rounded-md shadow-md">
          {props.rank}
        </div>
      </CardHeader>

      <CardContent className="font-display p-0 pb-4">
        {props.link ? (
          <h1 className="text-xl text-center truncate hover:underline cursor-pointer">
            <Link href={props.link}>{props.name}</Link>
          </h1>
        ) : (
          <h1 className="text-xl text-center truncate ">{props.name} </h1>
        )}

        <Separator className="my-2" />
        <div className="text-xs flex justify-between">
          <p>
            <FontAwesomeIcon icon={faEye} /> {props.views.toLocaleString()}
          </p>
          <p>
            <FontAwesomeIcon icon={faHeart} /> {props.hearts.toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
