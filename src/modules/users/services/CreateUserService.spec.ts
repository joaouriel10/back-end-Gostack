import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

describe('CreateUser', () => {
    it('should be able to create a new User', async () => {
        const fakesUsersRepository = new FakesUsersRepository();
        const fakeHashProvider = new FakeHashProvider();
        const createUser = new CreateUserService(fakesUsersRepository, fakeHashProvider);

        const user = await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        const fakesUsersRepository = new FakesUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakesUsersRepository, fakeHashProvider);

        await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        await expect(
            createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'}),
        ).rejects.toBeInstanceOf(AppError);
    });

});
