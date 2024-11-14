import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Get,
} from '@nestjs/common';
import { MutantService } from './mutant.service';
import { DnaDto } from './dto/mutant.dto';

@Controller('mutant')
export class MutantController {
  constructor(private readonly mutantService: MutantService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async isMutant(@Body() body: DnaDto): Promise<void> {
    const isMutant = await this.mutantService.isMutant(body.dna);

    if (!isMutant) {
      throw new ForbiddenException('Not a mutant');
    }
  }

  @Get('/stats')
  async getStats() {
    return await this.mutantService.getStats();
  }
}
