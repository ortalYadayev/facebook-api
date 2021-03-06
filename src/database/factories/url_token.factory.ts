import * as faker from 'faker';
import { UrlToken, UrlTokenEnum } from '../../entities/url_token.entity';
import BaseFactory from './base_factory';
import { User } from '../../entities/user.entity';
import { NonFunctionProperties } from './types';

class UrlTokenFactory extends BaseFactory<UrlToken> {
  protected Entity = UrlToken;

  protected definition(): NonFunctionProperties<UrlToken> {
    return {
      token: faker.random.alphaNumeric(120),
      expireAt: faker.date.future(),
    };
  }

  emailVerification(): this {
    return this.addToState({
      type: UrlTokenEnum.EMAIL_VERIFICATION,
    });
  }

  user(user: User): this {
    return this.addToState({ user });
  }

  expired(): this {
    return this.addToState({
      expireAt: faker.date.past(),
    });
  }
}

export default UrlTokenFactory;
