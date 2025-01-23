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
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch drinks by name',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
