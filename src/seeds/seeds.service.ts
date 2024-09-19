import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PokeResult } from './interfaces/poke-result.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter.adapter';

@Injectable()
export class SeedsService {
  constructor(
    private readonly _pokemonService: PokemonService,
    private readonly _http: AxiosAdapter,
  ) {}

  async executeSeeds() {
    const data = await this._http.get<PokeResult>(
      'https://pokeapi.co/api/v2/pokemon/?limit=650',
    );

    const pokemonsToInsert: CreatePokemonDto[] = [];

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      pokemonsToInsert.push({ name: name, no: no });
    });

    this._pokemonService.populateDB(pokemonsToInsert);

    return 'Seed executed successfully';
  }
}
