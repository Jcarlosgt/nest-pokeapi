import { join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedsModule } from './seeds/seeds.module';
import { AppConfig } from './config/app.config';
import { JoiConfig } from './config/joi.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [AppConfig],
      validationSchema: JoiConfig,
    }),

    ServeStaticModule.forRoot({
      rootPath: join('__dirname', '..', 'public'),
    }),

    MongooseModule.forRoot(process.env.MONGODB, {
      dbName: 'pokemonsdb',
    }),

    PokemonModule,

    CommonModule,

    SeedsModule,
  ],
})
export class AppModule {}
