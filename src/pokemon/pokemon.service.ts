import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly _pokemonModel: Model<Pokemon>,
    private readonly _configService: ConfigService,
  ) {
    this.defaultLimit = _configService.get<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();

    try {
      const pokemon = await this._pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.errorHandler(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0 } = paginationDto;

    return this._pokemonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(id: string) {
    let pokemon: Pokemon;

    if (!isNaN(+id)) {
      pokemon = await this._pokemonModel.findOne({ no: id });
    }

    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this._pokemonModel.findById(id);
    }

    if (!pokemon) {
      pokemon = await this._pokemonModel.findOne({ name: id });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `The pokemon id, name or no "${id}" not found`,
      );
    }

    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemonToEdit = await this.findOne(id);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      await pokemonToEdit.updateOne(updatePokemonDto, { new: true });

      return { ...pokemonToEdit.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.errorHandler(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this._pokemonModel.deleteOne({ _id: id });

    if (deletedCount === 0) {
      throw new BadRequestException(`The pokemon Id "${id}" not found`);
    }

    return;
  }

  async populateDB(createMany: CreatePokemonDto[]) {
    try {
      await this._pokemonModel.deleteMany({});

      await this._pokemonModel.insertMany(createMany);
    } catch (error) {
      this.errorHandler(error);
    }
  }

  errorHandler(error) {
    if (error.code == 11000) {
      throw new BadRequestException(
        `The pokemon already exist ${JSON.stringify(error.keyValue)}`,
      );
    }

    console.log(error);
    throw new InternalServerErrorException(
      `Can not create a pokemon - check logs`,
    );
  }
}
