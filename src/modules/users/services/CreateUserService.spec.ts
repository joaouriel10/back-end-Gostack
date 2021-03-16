import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakesUsersRepository: FakesUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        createUser = new CreateUserService(fakesUsersRepository, fakeHashProvider);
    })
    it('should be able to create a new User', async () => {
        const user = await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create a new user with same email from another', async () => {
        await createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'});

        await expect(
            createUser.execute({name: 'John Doe', email: 'john@example.com', password: '123456'}),
        ).rejects.toBeInstanceOf(AppError);
    });

});
