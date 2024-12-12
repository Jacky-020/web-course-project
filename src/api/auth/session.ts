import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  serializeUser(user: ReqUser, done: (err: Error, user: ReqUser) => void,): void {
    done(null, user);
  }

  deserializeUser(payload: string, 
                  done: (err: Error, payload: string) => void
    ): void {
    done(null, payload);
  }
}