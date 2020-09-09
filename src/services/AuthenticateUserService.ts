import { getRepository } from 'typeorm';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcryptjs';

import User from '../models/User';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class AutenticateUserService {
  public async execute({ email, password }: Request): Promise<Response>{
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({where: { email }}); 

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    delete user.password;

    const token = sign({  }, 'b63445c458223749ef5719d935a38b73', { subject: user.id, expiresIn: '1d' });

    return { user, token };

  }
}

export default AutenticateUserService;