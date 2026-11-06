class CreateSteps < ActiveRecord::Migration[8.0]
  def change
    create_table :steps do |t|
      t.references :recipe, null: false, foreign_key: { on_delete: :cascade }
      t.integer :position, null: false
      t.text :body, null: false

      t.timestamps
    end
  end
end
