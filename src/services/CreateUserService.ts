// Service criado para centralizar os metodos

import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface Request {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async execute({ name, email, password }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const checkUserExists = await userRepository.findOne({
      where: { email },
    });

    // verifica se o usuario existe
    if (checkUserExists) {
      throw new Error('Email address already used');
    }

    const hashedPassword = await hash(password, 8);

    // apenas cria uma instancia
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword,
    });

    // salva realmente no banco
    await userRepository.save(user);

    return user;
  }
}

export default CreateUserService;
