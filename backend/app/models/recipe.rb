class Recipe < ApplicationRecord
  has_many :ingredients, dependent: :destroy
  has_many :steps, -> { order(:position) }, dependent: :destroy

  # フォームから材料・手順をまとめて保存できるようにする
  accepts_nested_attributes_for :ingredients
  accepts_nested_attributes_for :steps

  validates :title, presence: true, length: { maximum: 50 }
  validates :description, length: { maximum: 200 }
  validates :cooking_time, numericality: { only_integer: true, in: 1..999 }, allow_nil: true
  validates :servings, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
end
