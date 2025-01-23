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

  async getDrinksByCategory(category: string) {
    try {
      const response = await axios.get(this.apiUrl, {
        headers: this.headers,
        params: { category },
      });
  
      // Process the raw response to extract relevant data
      const drinks = response.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        description: item.description,
        image: item.image,
        category: item.category,
        recipeYield: item.recipeYield,
        prepTime: item.prepTime,
        totalTime: item.totalTime,
        ingredients: item.recipeIngredient,
        instructions: item.recipeInstructions.map((step: any) => ({
          stepName: step.name,
          text: step.text,
        })),
      }));
  
      return drinks;
    } catch (error) {
      // Handle different error scenarios
      if (error.response) {
        // Server responded with a status other than 2xx
        throw new HttpException(
          `Failed to fetch drinks by category: ${error.response.data.message}`,
          error.response.status,
        );
      } else if (error.request) {
        // No response received from server
        throw new HttpException(
          'No response received from server while fetching drinks by category',
          HttpStatus.GATEWAY_TIMEOUT,
        );
      } else {
        // Other errors (e.g., network issues)
        throw new HttpException(
          `Error while fetching drinks by category: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
