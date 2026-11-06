module Api
  class RecipesController < ApplicationController
    before_action :set_recipe, only: %i[show update destroy]

    # GET /api/recipes
    def index
      recipes = Recipe.includes(:ingredients, :steps).order(created_at: :desc)
      render json: recipes.map { |recipe| recipe_json(recipe) }
    end

    # GET /api/recipes/:id
    def show
      render json: recipe_json(@recipe)
    end

    # POST /api/recipes
    def create
      recipe = Recipe.new(recipe_params)
      if recipe.save
        render json: recipe_json(recipe), status: :created
      else
        render_errors(recipe)
      end
    end

    # PATCH /api/recipes/:id
    # 材料・手順はフォームの内容でまるごと入れ替える
    def update
      Recipe.transaction do
        @recipe.ingredients.destroy_all
        @recipe.steps.destroy_all
        @recipe.update!(recipe_params)
      end
      render json: recipe_json(@recipe.reload)
    rescue ActiveRecord::RecordInvalid
      render_errors(@recipe)
    end

    # DELETE /api/recipes/:id
    def destroy
      @recipe.destroy!
      head :no_content
    end

    private

    def set_recipe
      @recipe = Recipe.find(params[:id])
    end

    def recipe_params
      params.require(:recipe).permit(
        :title, :description, :cooking_time, :servings,
        ingredients_attributes: %i[name quantity],
        steps_attributes: %i[position body]
      )
    end

    def recipe_json(recipe)
      recipe.as_json(
        only: %i[id title description cooking_time servings created_at updated_at],
        include: {
          ingredients: { only: %i[id name quantity] },
          steps: { only: %i[id position body] }
        }
      )
    end

    def render_errors(recipe)
      render json: { errors: recipe.errors.full_messages }, status: :unprocessable_entity
    end
  end
end
