import { Module } from '@nestjs/common';
import { SeedsService } from './seeds.service';
import { SeedsController } from './seeds.controller';
import { PokemonModule } from 'src/pokemon/pokemon.module';
import { CommonModule } from 'src/common/common.module';

@Module({
  controllers: [SeedsController],
  providers: [SeedsService],
  imports: [PokemonModule, CommonModule],
})
export class SeedsModule {}
