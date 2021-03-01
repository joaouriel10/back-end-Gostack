import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

describe('AuthenticateUser', () => {
    it('should be able to authenticate', async () => {
        const fakesUsersRepository = new FakesUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakesUsersRepository, fakeHashProvider);
        const authenticateUser = new AuthenticateUserService(fakesUsersRepository, fakeHashProvider);

        const user = await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        const response = await authenticateUser.execute({email: 'john@example.com', password: '123456'});

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        const fakesUsersRepository = new FakesUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const authenticateUser = new AuthenticateUserService(fakesUsersRepository, fakeHashProvider);

        expect(
            authenticateUser.execute({email: 'john@example.com', password: '123456'}),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        const fakesUsersRepository = new FakesUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUser = new CreateUserService(fakesUsersRepository, fakeHashProvider);
        const authenticateUser = new AuthenticateUserService(fakesUsersRepository, fakeHashProvider);

        await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        expect(
            authenticateUser.execute({email: 'john@example.com', password: 'wrong-password'})
        ).rejects.toBeInstanceOf(AppError);
    });
});
