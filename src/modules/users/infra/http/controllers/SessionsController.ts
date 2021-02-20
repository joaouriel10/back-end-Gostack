import { Request, Response} from 'express';

import { container } from 'tsyringe';

import AutenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
    public async create(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;

        const autenticateUser = container.resolve(AutenticateUserService);

        const { user, token } = await autenticateUser.execute({ email, password });

        return response.json({ user, token });
    }
}