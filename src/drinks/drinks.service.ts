import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class DrinksService {
  private readonly apiUrl = 'https://starbucks-coffee-db2.p.rapidapi.com/api/recipes';
  private readonly headers = {
    'X-Rapidapi-Key': 'f8a41a9358msh5356d697b61ff3ep1010e9jsn323d54608026',
    'X-Rapidapi-Host': 'starbucks-coffee-db2.p.rapidapi.com',
  };

  async getDrinksByName(name: string) {
    try {
      const response = await axios.get(this.apiUrl, {
        headers: this.headers,
        params: { name },
      });

      // Format the raw response
      const formattedData = response.data.map((drink) => ({
        id: drink._id,
        name: drink.name,
        image: drink.image,
        description: drink.description,
        category: drink.category,
        yield: drink.recipeYield,
        prepTime: drink.prepTime,
        totalTime: drink.totalTime,
        ingredients: drink.recipeIngredient.filter((ingredient) => ingredient.trim() !== ''),
        instructions: drink.recipeInstructions.map((step) => ({
          stepName: step.name,
          description: step.text,
          image: step.image || null,
        })),
      }));

      return formattedData;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch drinks by name',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
