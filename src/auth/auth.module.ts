import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    // 🖨️ We plug in the Keycard Machine!
    JwtModule.register({
      secret: 'my-super-secret-key', // The ink used to print the card. (In a real app, this goes in the .env file!)
      signOptions: { expiresIn: '1d' }, // The keycard expires in 1 day
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
