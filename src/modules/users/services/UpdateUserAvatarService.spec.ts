import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';

import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakesUsersRepository: FakesUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatarService', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        fakeStorageProvider = new FakeStorageProvider();
        updateUserAvatar = new UpdateUserAvatarService(fakesUsersRepository, fakeStorageProvider);
    })
    it('should be able to create a new User', async () => {
        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        await updateUserAvatar.execute({ user_id: user.id, avatarFileName: 'avatar.jpg' });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar from non existing user', async () => {
        await expect(
            updateUserAvatar.execute({ user_id: 'non-existing-user', avatarFileName: 'avatar.jpg' })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete ond avatar when updating new one', async () => {
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        await updateUserAvatar.execute({ user_id: user.id, avatarFileName: 'avatar.jpg' });

        await updateUserAvatar.execute({ user_id: user.id, avatarFileName: 'avatar2.jpg' });

        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
        expect(user.avatar).toBe('avatar2.jpg');
    });
});
