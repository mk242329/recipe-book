"use client";

import { useRouter } from "next/navigation";
import RecipeForm from "@/components/RecipeForm";
import { createRecipe } from "@/lib/api";

// S-03 レシピ登録
export default function NewRecipePage() {
  const router = useRouter();

  return (
    <>
      <h1>レシピを登録</h1>
      <RecipeForm
        submitLabel="登録する"
        onSubmit={async (input) => {
          const recipe = await createRecipe(input);
          router.push(`/recipes/${recipe.id}`);
        }}
      />
    </>
  );
}
