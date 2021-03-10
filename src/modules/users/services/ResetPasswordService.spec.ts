import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import ResetPasswordService from './ResetPasswordService';

let fakesUsersRepository: FakesUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {
    beforeEach(() => {
      fakesUsersRepository = new FakesUsersRepository();
      fakeUserTokensRepository = new FakeUserTokensRepository();
      fakeHashProvider = new FakeHashProvider();

      resetPassword = new ResetPasswordService(fakesUsersRepository, fakeUserTokensRepository, fakeHashProvider);
    });

    it('should be able to reset the password', async () => {
        const user = await fakesUsersRepository.create({name: 'John Doe', email: 'john@example.com', password: '123456'});

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPassword.execute({ password: '123123', token });
        
        const updateUser = await fakesUsersRepository.findById(user.id);

        expect(generateHash).toHaveBeenCalledWith('123123');
        expect(updateUser?.password).toBe('123123');
    });

    it('should not be able to reset password with non-existing token', async () => {
        await expect(
            resetPassword.execute({ token: 'non-existing-token', password: '123456' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate('non-existing-user');

        await expect(
            resetPassword.execute({ token, password: '123456' }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset password if passed more than 2 hours', async () => {
        const user = await fakesUsersRepository.create({name: 'John Doe', email: 'john@example.com', password: '123456'});

        const { token } = await fakeUserTokensRepository.generate(user.id);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();

            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPassword.execute({ password: '123123', token })
        ).rejects.toBeInstanceOf(AppError);

    });
});
