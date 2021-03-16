import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';
import AuthenticateUserService from './AuthenticateUserService';

let fakesUsersRepository: FakesUsersRepository;
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let authenticateUser: AuthenticateUserService

describe('AuthenticateUser', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(fakesUsersRepository, fakeHashProvider);
        authenticateUser = new AuthenticateUserService(fakesUsersRepository, fakeHashProvider); 
    });

    it('should be able to authenticate', async () => {
        const user = await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        const response = await authenticateUser.execute({email: 'john@example.com', password: '123456'});

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to authenticate with non existing user', async () => {
        await expect(
            authenticateUser.execute({email: 'john@example.com', password: '123456'}),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to authenticate with wrong password', async () => {
        await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        await expect(
            authenticateUser.execute({email: 'john@example.com', password: 'wrong-password'})
        ).rejects.toBeInstanceOf(AppError);
    });
});
