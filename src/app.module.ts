import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MutantModule } from './mutant/mutant.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import config from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, {
      connectionFactory: (connection) => {
        connection.on('connected', () => {
          console.log('MongoDB Is connected');
        });
        connection.on('error', (error) => {
          console.log('DB connection failed! for error: ', error);
        });
        connection._events.connected();
        return connection;
      },
    }),
    MutantModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
