import { Controller, Get, Query } from '@nestjs/common';
import { DrinksService } from './drinks.service';

@Controller('drinks')
export class DrinksController {
  constructor(private readonly drinksService: DrinksService) {}

  @Get('by-category')
  async getDrinksByCategory(@Query('category') category: string) {
    return this.drinksService.getDrinksByCategory(category);
  }
}
