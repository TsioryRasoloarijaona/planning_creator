import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { findAccount } from './dto/find-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/crypto.util';
import { createAccountRequest } from './dto/create-account-request.dto';
import { generatePassword } from 'src/utils/password-ganerator.util';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly db: DatabaseService) {}
  async create(createAccount: createAccountRequest) {
    if (await this.findByEmail(createAccount.email)) {
      throw new ConflictException(`${createAccount.email} is already taken`);
    }
    const generatedPassword = generatePassword();
    const encryptedPwd = await hashPassword(generatedPassword);
    const newAccount: CreateAccountDto = {
      name: createAccount.name,
      email: createAccount.email,
      password: encryptedPwd,
      role: createAccount.role,
    };
    const createdAccount = await this.db.account.create({
      data: newAccount,
    });

    return {
      id: createdAccount.id,
      name: createdAccount.name,
      email: createdAccount.email,
      password: generatedPassword,
      role: createdAccount.role,
    };
  }

  async findAll(): Promise<findAccount[]> {
    return this.db.account.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      },
    });
  }

  async findOne(id: number) {
    console.log('id', typeof id);
    const account = await this.db.account.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
    if (!account) {
      throw new NotFoundException(`account with id ${id} is not found`);
    }
    return account;
  }

  async findByEmail(email: string) {
    const account = await this.db.account.findUnique({
      where: {
        email: email,
      },
    });
    if (account) return account;
    else return null;
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}