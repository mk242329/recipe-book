"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { fetchRecipe, RecipeInput, updateRecipe } from "@/lib/api";

// S-04 レシピ編集
export default function EditRecipePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initial, setInitial] = useState<RecipeInput | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRecipe(id)
      .then((recipe) =>
        setInitial({
          title: recipe.title,
          description: recipe.description ?? "",
          cooking_time: recipe.cooking_time,
          servings: recipe.servings,
          ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: "", quantity: "" }],
          steps: recipe.steps.length > 0 ? recipe.steps : [{ position: 1, body: "" }],
        }),
      )
      .catch(() => setError("レシピが見つかりませんでした。"));
  }, [id]);

  if (error) return <p className="errors">{error}</p>;
  if (!initial) return <p>読み込み中…</p>;

  return (
    <>
      <h1>レシピを編集</h1>
      <RecipeForm
        initial={initial}
        submitLabel="更新する"
        onSubmit={async (input) => {
          await updateRecipe(id, input);
          router.push(`/recipes/${id}`);
        }}
      />
    </>
  );
}
