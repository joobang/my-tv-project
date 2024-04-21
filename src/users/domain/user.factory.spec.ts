import { Test } from '@nestjs/testing';
import { EventBus } from '@nestjs/cqrs';
import { UserFactory } from './user.factory';
import { User } from './user';

describe('UserFacactory', () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        {
          provide: EventBus,
          useValue: {
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    it('should create user', () => {
      // Given

      // When
      const user = userFactory.create(
        'user-id',
        'YOUR_NAME',
        'YOUR_EMAIL@gmail.com',
        'signup-verify-token',
        'pass1234',
      );

      // Then
      const expected = new User(
        'user-id',
        'YOUR_NAME',
        'YOUR_EMAIL@gmail.com',
        'signup-verify-token',
        'pass1234',
      );

      expect(expected).toEqual(user);
      expect(eventBus.publish).toBeCalledTimes(1);
    });
  });
});
