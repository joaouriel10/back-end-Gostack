import AppError from '@shared/errors/AppError';

import FakesUsersRepository from '../repositories/fakes/FakesUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';

import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakesUsersRepository: FakesUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        fakeMailProvider = new FakeMailProvider();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        sendForgotPasswordEmail = new SendForgotPasswordEmailService(fakesUsersRepository, fakeMailProvider, fakeUserTokensRepository);
    });

    it('should be able to recover the password using the email', async () => {
        

        const sendEmail = jest.spyOn(fakeMailProvider, 'sendMail');

        await fakesUsersRepository.create({name: 'John Doe', email: 'john@example.com', password: '123456'});

        await sendForgotPasswordEmail.execute({ email: 'john@example.com' });

        expect(sendEmail).toHaveBeenCalled();
    });

    it('should not be able to recover a non-existing user password', async () => {

        await expect(
            sendForgotPasswordEmail.execute({ email: 'john@example.com' })
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should generate a forgot password token', async () => {
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

        const user = await fakesUsersRepository.create({name: 'John Doe', email: 'john@example.com', password: '123456'});

        await sendForgotPasswordEmail.execute({ email: 'john@example.com' });

        expect(generateToken).toHaveBeenCalledWith(user.id);
    });
});
