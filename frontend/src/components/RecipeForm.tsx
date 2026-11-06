"use client";

import { useState } from "react";
import { Ingredient, RecipeInput, Step, ValidationError } from "@/lib/api";

type Props = {
  initial?: RecipeInput;
  submitLabel: string;
  onSubmit: (input: RecipeInput) => Promise<void>;
};

const emptyInput: RecipeInput = {
  title: "",
  description: "",
  cooking_time: null,
  servings: null,
  ingredients: [{ name: "", quantity: "" }],
  steps: [{ position: 1, body: "" }],
};

// 数値の入力欄：空なら null、それ以外は数値にする
const toNumber = (value: string) => (value === "" ? null : Number(value));

export default function RecipeForm({ initial = emptyInput, submitLabel, onSubmit }: Props) {
  const [input, setInput] = useState<RecipeInput>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // ---- 材料 ----
  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const ingredients = input.ingredients.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    setInput({ ...input, ingredients });
  };
  const addIngredient = () =>
    setInput({ ...input, ingredients: [...input.ingredients, { name: "", quantity: "" }] });
  const removeIngredient = (index: number) =>
    setInput({ ...input, ingredients: input.ingredients.filter((_, i) => i !== index) });

  // ---- 手順（番号は並び順から振り直す） ----
  const renumber = (steps: Step[]) => steps.map((step, i) => ({ ...step, position: i + 1 }));
  const updateStep = (index: number, body: string) => {
    const steps = input.steps.map((step, i) => (i === index ? { ...step, body } : step));
    setInput({ ...input, steps });
  };
  const addStep = () =>
    setInput({ ...input, steps: renumber([...input.steps, { position: 0, body: "" }]) });
  const removeStep = (index: number) =>
    setInput({ ...input, steps: renumber(input.steps.filter((_, i) => i !== index)) });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);
    setSubmitting(true);
    try {
      // 空の行は送らない
      await onSubmit({
        ...input,
        ingredients: input.ingredients.filter((item) => item.name.trim() !== ""),
        steps: renumber(input.steps.filter((step) => step.body.trim() !== "")),
      });
    } catch (err) {
      if (err instanceof ValidationError) {
        setErrors(err.messages);
      } else {
        setErrors([err instanceof Error ? err.message : "保存に失敗しました"]);
      }
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      {errors.length > 0 && (
        <ul className="errors">
          {errors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      )}

      <label>
        料理名 <span className="required">必須</span>
        <input
          value={input.title}
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          maxLength={50}
          required
        />
      </label>

      <label>
        ひとこと説明
        <textarea
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
          maxLength={200}
          rows={2}
        />
      </label>

      <div className="row">
        <label>
          調理時間（分）
          <input
            type="number"
            min={1}
            max={999}
            value={input.cooking_time ?? ""}
            onChange={(e) => setInput({ ...input, cooking_time: toNumber(e.target.value) })}
          />
        </label>
        <label>
          何人分
          <input
            type="number"
            min={1}
            max={20}
            value={input.servings ?? ""}
            onChange={(e) => setInput({ ...input, servings: toNumber(e.target.value) })}
          />
        </label>
      </div>

      <fieldset>
        <legend>材料</legend>
        {input.ingredients.map((item, i) => (
          <div className="line" key={i}>
            <input
              placeholder="例：玉ねぎ"
              value={item.name}
              onChange={(e) => updateIngredient(i, "name", e.target.value)}
            />
            <input
              placeholder="例：1個"
              value={item.quantity}
              onChange={(e) => updateIngredient(i, "quantity", e.target.value)}
              className="short"
            />
            <button type="button" className="link" onClick={() => removeIngredient(i)}>
              削除
            </button>
          </div>
        ))}
        <button type="button" className="secondary" onClick={addIngredient}>
          ＋ 材料を追加
        </button>
      </fieldset>

      <fieldset>
        <legend>作り方</legend>
        {input.steps.map((step, i) => (
          <div className="line" key={i}>
            <span className="step-no">{step.position}</span>
            <textarea
              rows={2}
              value={step.body}
              onChange={(e) => updateStep(i, e.target.value)}
            />
            <button type="button" className="link" onClick={() => removeStep(i)}>
              削除
            </button>
          </div>
        ))}
        <button type="button" className="secondary" onClick={addStep}>
          ＋ 手順を追加
        </button>
      </fieldset>

      <button type="submit" disabled={submitting}>
        {submitting ? "保存中…" : submitLabel}
      </button>
    </form>
  );
}
