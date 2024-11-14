import { Test, TestingModule } from '@nestjs/testing';
import { MutantService } from './mutant.service';
import { MutantController } from './mutant.controller';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { DNA } from './schemas/dna.schema';

describe('MutantService', () => {
  let service: MutantService;
  let dnaModel: Model<DNA>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MutantService,
        {
          provide: getModelToken(DNA.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MutantService>(MutantService);
    dnaModel = module.get<Model<DNA>>(getModelToken(DNA.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should detect mutant DNA with horizontal sequence', async () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];

    (dnaModel.findOne as jest.Mock).mockResolvedValue(null);

    (dnaModel.create as jest.Mock).mockResolvedValue({
      sequence: dna.join(''),
      isMutant: true,
    });

    expect(await service.isMutant(dna)).toBe(true);
  });

  it('should detect mutant DNA with vertical sequence', async () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'TCACTG', 'TCACTG'];

    (dnaModel.findOne as jest.Mock).mockResolvedValue(null);
    (dnaModel.create as jest.Mock).mockResolvedValue({
      sequence: dna.join(''),
      isMutant: true,
    });

    expect(await service.isMutant(dna)).toBe(true);
  });

  it('should detect mutant DNA with diagonal sequence', async () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGGAGG', 'TCACTG', 'TCACTG'];

    (dnaModel.findOne as jest.Mock).mockResolvedValue(null);
    (dnaModel.create as jest.Mock).mockResolvedValue({
      sequence: dna.join(''),
      isMutant: true,
    });

    expect(await service.isMutant(dna)).toBe(true);
  });

  it('should return cached result if DNA sequence already exists', async () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATGT', 'AGAAGG', 'CCCCTA', 'TCACTG'];

    (dnaModel.findOne as jest.Mock).mockResolvedValue({
      sequence: dna.join(''),
      isMutant: true,
    });

    expect(await service.isMutant(dna)).toBe(true);
    expect(dnaModel.create).not.toHaveBeenCalled();
  });

  it('should not detect mutant DNA in non-mutant DNA', async () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];

    (dnaModel.findOne as jest.Mock).mockResolvedValue(null);
    (dnaModel.create as jest.Mock).mockResolvedValue({
      sequence: dna.join(''),
      isMutant: false,
    });

    expect(await service.isMutant(dna)).toBe(false);
  });

  it('should return cached result for non-mutant DNA if it exists in the database', async () => {
    const dna = ['ATGCGA', 'CAGTGC', 'TTATTT', 'AGACGG', 'GCGTCA', 'TCACTG'];

    (dnaModel.findOne as jest.Mock).mockResolvedValue({
      sequence: dna.join(''),
      isMutant: false,
    });

    expect(await service.isMutant(dna)).toBe(false);
    expect(dnaModel.create).not.toHaveBeenCalled();
  });
});

describe('MutantController', () => {
  let controller: MutantController;
  let service: MutantService;

  beforeEach(async () => {
    const mockMutantService = {
      getStats: jest.fn().mockReturnValue({
        count_mutant_dna: 40,
        count_human_dna: 100,
        ratio: 0.4,
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [MutantController],
      providers: [
        {
          provide: MutantService,
          useValue: mockMutantService,
        },
      ],
    }).compile();

    controller = module.get<MutantController>(MutantController);
    service = module.get<MutantService>(MutantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return stats for mutant DNA', async () => {
    const result = await controller.getStats();
    expect(result).toEqual({
      count_mutant_dna: 40,
      count_human_dna: 100,
      ratio: 0.4,
    });
    expect(service.getStats).toHaveBeenCalled();
  });
});
