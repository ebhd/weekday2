import Link from "next/link";

export default function Home() {
  return (
    <nav className="pt-10">
      <ul className="flex flex-row justify-center space-x-10 text-xl">
        <li>
          <Link href={"/"}>Home</Link>
        </li>
        <li>
          <Link href={"/"}>Search</Link>
        </li>
        <li>
          <Link href={"/"}>About us</Link>
        </li>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
      </ul>
    </nav>
  );
}
