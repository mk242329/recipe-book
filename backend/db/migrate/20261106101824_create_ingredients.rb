class CreateIngredients < ActiveRecord::Migration[8.0]
  def change
    create_table :ingredients do |t|
      t.references :recipe, null: false, foreign_key: { on_delete: :cascade }
      t.string :name, null: false
      t.string :quantity

      t.timestamps
    end
  end
end
