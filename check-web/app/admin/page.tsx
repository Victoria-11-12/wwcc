import Link from "next/link";
import { Button } from "antd";

export default function Admin() {
  return (
    <div>
      <div>Admin Page</div>
      <Link href="/home">
        <Button type="primary">返回首页</Button>
      </Link>
    </div>
  );
}
