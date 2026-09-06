import Link from "next/link";

export default function start() {
  return (
    <div>
      <div>Welcome to the Start Page</div>
      <Link href="/home">进入首页</Link>
    </div>
  );
}
