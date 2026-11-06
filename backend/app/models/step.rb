class Step < ApplicationRecord
  belongs_to :recipe

  validates :position, presence: true
  validates :body, presence: true, length: { maximum: 500 }
end
