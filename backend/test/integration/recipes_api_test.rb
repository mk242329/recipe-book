require "test_helper"

class RecipesApiTest < ActionDispatch::IntegrationTest
  setup do
    @recipe = recipes(:curry)
  end

  test "一覧を取得できる" do
    get "/api/recipes"
    assert_response :success
    assert_equal "カレーライス", response.parsed_body.first["title"]
  end

  test "詳細に材料と手順が含まれる" do
    get "/api/recipes/#{@recipe.id}"
    assert_response :success
    body = response.parsed_body
    assert_equal "玉ねぎ", body["ingredients"].first["name"]
    assert_equal "玉ねぎを薄切りにする", body["steps"].first["body"]
  end

  test "存在しないレシピは 404" do
    get "/api/recipes/0"
    assert_response :not_found
  end

  test "材料と手順つきで登録できる" do
    assert_difference [ "Recipe.count", "Ingredient.count", "Step.count" ], 1 do
      post "/api/recipes", params: {
        recipe: {
          title: "味噌汁", cooking_time: 10, servings: 2,
          ingredients_attributes: [ { name: "豆腐", quantity: "1/2丁" } ],
          steps_attributes: [ { position: 1, body: "だしを温める" } ]
        }
      }, as: :json
    end
    assert_response :created
  end

  test "料理名が空だと日本語のエラーが返る" do
    assert_no_difference "Recipe.count" do
      post "/api/recipes", params: { recipe: { title: "" } }, as: :json
    end
    assert_response :unprocessable_entity
    assert_includes response.parsed_body["errors"], "料理名を入力してください"
  end

  test "更新すると材料と手順が入れ替わる" do
    patch "/api/recipes/#{@recipe.id}", params: {
      recipe: {
        title: "ポークカレー",
        ingredients_attributes: [ { name: "豚肉", quantity: "300g" }, { name: "人参", quantity: "1本" } ],
        steps_attributes: [ { position: 1, body: "肉を炒める" } ]
      }
    }, as: :json
    assert_response :success
    @recipe.reload
    assert_equal "ポークカレー", @recipe.title
    assert_equal %w[豚肉 人参], @recipe.ingredients.map(&:name)
    assert_equal [ "肉を炒める" ], @recipe.steps.map(&:body)
  end

  test "更新でエラーになったら材料と手順は元のまま" do
    patch "/api/recipes/#{@recipe.id}", params: {
      recipe: { title: "", ingredients_attributes: [ { name: "豚肉" } ] }
    }, as: :json
    assert_response :unprocessable_entity
    @recipe.reload
    assert_equal "カレーライス", @recipe.title
    assert_equal [ "玉ねぎ" ], @recipe.ingredients.map(&:name)
  end

  test "削除すると材料と手順も消える" do
    assert_difference [ "Recipe.count", "Ingredient.count", "Step.count" ], -1 do
      delete "/api/recipes/#{@recipe.id}"
    end
    assert_response :no_content
  end
end
