// Rails API とやり取りするための型と関数をまとめたファイル

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export type Ingredient = {
  id?: number;
  name: string;
  quantity: string;
};

export type Step = {
  id?: number;
  position: number;
  body: string;
};

export type Recipe = {
  id: number;
  title: string;
  description: string | null;
  cooking_time: number | null;
  servings: number | null;
  ingredients: Ingredient[];
  steps: Step[];
  created_at: string;
  updated_at: string;
};

// 登録・更新のときに送るデータ
export type RecipeInput = {
  title: string;
  description: string;
  cooking_time: number | null;
  servings: number | null;
  ingredients: Ingredient[];
  steps: Step[];
};

// 入力エラー（422）のときに投げるエラー。messages に Rails からのメッセージが入る
export class ValidationError extends Error {
  constructor(public messages: string[]) {
    super(messages.join("\n"));
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    cache: "no-store",
  });

  if (res.status === 422) {
    const body = await res.json();
    throw new ValidationError(body.errors ?? ["入力内容を確認してください"]);
  }
  if (!res.ok) {
    throw new Error(`通信に失敗しました（${res.status}）`);
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return res.json();
}

// Rails の accepts_nested_attributes_for に合わせた形に変換する
function toPayload(input: RecipeInput) {
  const { ingredients, steps, ...rest } = input;
  return {
    recipe: {
      ...rest,
      ingredients_attributes: ingredients.map(({ name, quantity }) => ({ name, quantity })),
      steps_attributes: steps.map(({ position, body }) => ({ position, body })),
    },
  };
}

export const fetchRecipes = () => request<Recipe[]>("/api/recipes");

export const fetchRecipe = (id: string | number) => request<Recipe>(`/api/recipes/${id}`);

export const createRecipe = (input: RecipeInput) =>
  request<Recipe>("/api/recipes", { method: "POST", body: JSON.stringify(toPayload(input)) });

export const updateRecipe = (id: string | number, input: RecipeInput) =>
  request<Recipe>(`/api/recipes/${id}`, { method: "PATCH", body: JSON.stringify(toPayload(input)) });

export const deleteRecipe = (id: string | number) =>
  request<void>(`/api/recipes/${id}`, { method: "DELETE" });
