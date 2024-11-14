import { Module } from '@nestjs/common';
import { MutantController } from './mutant.controller';
import { MutantService } from './mutant.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DNA, DNASchema } from './schemas/dna.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: DNA.name, schema: DNASchema }])],
  controllers: [MutantController],
  providers: [MutantService],
})
export class MutantModule {}
