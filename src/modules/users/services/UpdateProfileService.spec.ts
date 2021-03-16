import AppError from '@shared/errors/AppError';

import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';

import UpdateProfileService from './UpdateProfileService';

let fakesUsersRepository: FakesUsersRepository;
let fakeHashProvider: FakeHashProvider;
let UpdateProfile: UpdateProfileService;

describe('UpdateProfileService', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        UpdateProfile = new UpdateProfileService(fakesUsersRepository, fakeHashProvider);
    });

    it('should be able to update the profile', async () => {
        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        const updatedUser = await UpdateProfile.execute({ user_id: user.id, name: 'John Tre', email: 'johntr@example.com'});

        expect(updatedUser.name).toBe('John Tre');
        expect(updatedUser.email).toBe('johntr@example.com');
    });

    it('should not be able update the profile from non-existing user', async () => {
        await expect(
            UpdateProfile.execute({ user_id: 'non-existing-user', name: 'John Tre', email: 'johntr@example.com'})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to chance to another user email', async () => {
        await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        const user = await fakesUsersRepository.create({ name: 'Test', email: 'test@example.com', password: '123456' });

        await expect(
            UpdateProfile.execute({ user_id: user.id, name: 'John Tre', email: 'john@example.com'})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        const updatedUser = await UpdateProfile.execute({ user_id: user.id, name: 'John Tre', email: 'johntr@example.com', old_password: '123456', password: '123123'});

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without old password', async () => {
        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        await expect(
            UpdateProfile.execute({ user_id: user.id, name: 'John Tre', email: 'johntr@example.com', password: '123123'})
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password without wrong old password', async () => {
        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        await expect(
            UpdateProfile.execute({ user_id: user.id, name: 'John Tre', email: 'johntr@example.com', old_password: 'wrong-old-password', password: '123123'})
        ).rejects.toBeInstanceOf(AppError);
    });
});
