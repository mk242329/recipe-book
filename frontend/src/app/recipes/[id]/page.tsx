"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { deleteRecipe, fetchRecipe, Recipe } from "@/lib/api";

// S-02 レシピ詳細
export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecipe(id)
      .then(setRecipe)
      .catch(() => setError("レシピが見つかりませんでした。"));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("このレシピを削除しますか？")) return;
    await deleteRecipe(id);
    router.push("/");
  };

  if (error) return <p className="errors">{error}</p>;
  if (!recipe) return <p>読み込み中…</p>;

  return (
    <article className="detail">
      <h1>{recipe.title}</h1>
      {recipe.description && <p>{recipe.description}</p>}
      <p className="meta">
        {recipe.cooking_time && <span>調理時間 {recipe.cooking_time}分</span>}
        {recipe.servings && <span>{recipe.servings}人分</span>}
      </p>

      <h2>材料</h2>
      <table className="ingredients">
        <tbody>
          {recipe.ingredients.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>作り方</h2>
      <ol className="steps">
        {recipe.steps.map((step) => (
          <li key={step.id}>{step.body}</li>
        ))}
      </ol>

      <div className="actions">
        <Link href={`/recipes/${recipe.id}/edit`} className="button">
          編集する
        </Link>
        <button type="button" className="danger" onClick={handleDelete}>
          削除する
        </button>
      </div>
    </article>
  );
}
