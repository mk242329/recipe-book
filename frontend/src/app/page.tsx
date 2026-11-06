"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchRecipes, Recipe } from "@/lib/api";

// S-01 レシピ一覧
export default function RecipeListPage() {
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecipes()
      .then(setRecipes)
      .catch(() => setError("レシピを読み込めませんでした。API サーバーが起動しているか確認してください。"));
  }, []);

  if (error) return <p className="errors">{error}</p>;
  if (!recipes) return <p>読み込み中…</p>;

  return (
    <>
      <h1>レシピ一覧</h1>
      {recipes.length === 0 ? (
        <p className="empty">
          まだレシピがありません。<Link href="/recipes/new">最初のレシピを登録</Link>しましょう。
        </p>
      ) : (
        <ul className="cards">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Link href={`/recipes/${recipe.id}`} className="card">
                <h2>{recipe.title}</h2>
                {recipe.description && <p>{recipe.description}</p>}
                <p className="meta">
                  {recipe.cooking_time && <span>{recipe.cooking_time}分</span>}
                  {recipe.servings && <span>{recipe.servings}人分</span>}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
