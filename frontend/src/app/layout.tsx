import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "レシピ帳",
  description: "自分のレシピを登録・管理するアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <header className="header">
          <Link href="/" className="logo">
            レシピ帳
          </Link>
          <nav>
            <Link href="/">一覧</Link>
            <Link href="/recipes/new" className="button">
              レシピを登録
            </Link>
          </nav>
        </header>
        <main className="main">{children}</main>
      </body>
    </html>
  );
}
