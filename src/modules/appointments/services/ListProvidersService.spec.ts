import FakesUsersRepository from '@modules/users/repositories/fakes/FakesUsersRepository';

import ListProvidersService from './ListProvidersService';

let fakesUsersRepository: FakesUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
    beforeEach(() => {
        fakesUsersRepository = new FakesUsersRepository();
        listProvidersService = new ListProvidersService(fakesUsersRepository);
    });

    it('should be able to list the providers', async () => {
        const user1 = await fakesUsersRepository.create({ name: 'John Doe', email: 'john@example.com', password: '123456' });
        const user2 =await fakesUsersRepository.create({ name: 'John Tre', email: 'johntre@example.com', password: '123456' });

        const loggedUser = await fakesUsersRepository.create({ name: 'John Qua', email: 'johnqua@example.com', password: '123456' });


        const providers = await listProvidersService.execute({ user_id: loggedUser.id });

        expect(providers).toEqual([
            user1,
            user2
        ]);
    });
});
