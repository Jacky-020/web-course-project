import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/api/user/user.schema';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }
  /**
   * Validates the user with a given username and password.
   * 
   * This method is expected by passportJS to validate the credentials
   * of a user. `username` and `password` are expected in the payload
   * of LocalAuthGuard endpoints, and are passed to this validate function
   * 
   * 
   * @param username 
   * @param password 
   * @returns 
   */
  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (typeof user == 'string') {
      throw new UnauthorizedException('Wrong username or password.');
    }
    return user;
  }
}