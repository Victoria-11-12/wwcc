import Link from "next/link";

export default function Admin() {
  return (
    <div>
      <div>Admin Page</div>
      <Link href="/home">返回首页</Link>
    </div>
  );
}
