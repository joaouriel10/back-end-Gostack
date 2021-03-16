import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';

import ShowProfileService from './ShowProfileService';

let fakesUsersRepository: FakesUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfileService', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        showProfile = new ShowProfileService(fakesUsersRepository);
    });

    it('should be able show the profile', async () => {
        const user = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });

        const profile = await showProfile.execute({ user_id: user.id });

        expect(profile.name).toBe('John Doe');
        expect(profile.email).toBe('john@example.com');
    });

    it('should not be able show the profile from non-existing user', async () => {
        await expect(
            showProfile.execute({ user_id: 'non-existing-user' })
        ).rejects.toBeInstanceOf(AppError);
    });
});
