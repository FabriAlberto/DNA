import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DNA } from './schemas/dna.schema';
import { Model } from 'mongoose';

@Injectable()
export class MutantService {
  constructor(@InjectModel(DNA.name) private dnaModel: Model<DNA>) {}

  async isMutant(dna: string[]): Promise<boolean> {
    const dnaString = dna.join('');
    const existingDNA = await this.dnaModel.findOne({ sequence: dnaString });
    if (existingDNA) {
      return existingDNA.isMutant;
    }

    const SEQUENCE_LENGTH = 4;
    const matrixSize = dna.length;
    let sequenceCount = 0;

    for (let row = 0; row < matrixSize; row++) {
      for (let col = 0; col < matrixSize; col++) {
        if (
          col <= matrixSize - SEQUENCE_LENGTH &&
          this.hasConsecutiveSequence(row, col, 0, 1, dna)
        ) {
          sequenceCount++;
        }
        if (
          row <= matrixSize - SEQUENCE_LENGTH &&
          this.hasConsecutiveSequence(row, col, 1, 0, dna)
        ) {
          sequenceCount++;
        }
        if (
          row <= matrixSize - SEQUENCE_LENGTH &&
          col <= matrixSize - SEQUENCE_LENGTH &&
          this.hasConsecutiveSequence(row, col, 1, 1, dna)
        ) {
          sequenceCount++;
        }
        if (
          row <= matrixSize - SEQUENCE_LENGTH &&
          col >= 3 &&
          this.hasConsecutiveSequence(row, col, 1, -1, dna)
        ) {
          sequenceCount++;
        }
        if (sequenceCount > 1) break;
      }
    }
    const isMutant = sequenceCount > 1;
    await this.dnaModel.create({ sequence: dnaString, isMutant });
    return isMutant;
  }
  async getStats() {
    const countMutantDNA = await this.dnaModel.countDocuments({
      isMutant: true,
    });
    const countHumanDNA = await this.dnaModel.countDocuments();
    const ratio = countHumanDNA ? countMutantDNA / countHumanDNA : 0;
    return {
      count_mutant_dna: countMutantDNA,
      count_human_dna: countHumanDNA,
      ratio,
    };
  }
  private hasConsecutiveSequence(
    startX: number,
    startY: number,
    stepX: number,
    stepY: number,
    dna: string[],
  ): boolean {
    const sequenceChar = dna[startX][startY];
    const matrixSize = dna.length;

    for (let i = 1; i < 4; i++) {
      startX += stepX;
      startY += stepY;
      if (
        startX < 0 ||
        startX >= matrixSize ||
        startY < 0 ||
        startY >= matrixSize ||
        dna[startX][startY] !== sequenceChar
      ) {
        return false;
      }
    }
    return true;
  }
}
