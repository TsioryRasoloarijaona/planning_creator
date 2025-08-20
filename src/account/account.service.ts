import { Injectable, NotFoundException } from '@nestjs/common';
import { findAccount } from './dto/find-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from 'src/database/database.service';
import { Account } from 'generated/prisma';
import { hashPassword } from 'src/utils/crypto.util';
import { createAccountRequest } from './dto/create-account-request.dto';
import { generatePassword } from 'src/utils/password-ganerator.util';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountService {
  constructor(private readonly db: DatabaseService) {}
  async create(createAccount: createAccountRequest) {
    const generatedPassword = generatePassword();
    const encryptedPwd = await hashPassword(generatedPassword);
    const newAccount: CreateAccountDto = {
      name: createAccount.name,
      email: createAccount.email,
      password: encryptedPwd,
    };
    this.db.account.create({
      data: newAccount,
    });

    return {
      name: createAccount.name,
      email: createAccount.email,
      password: generatedPassword,
    };
  }

  async findAll(): Promise<findAccount[]> {
    return this.db.account.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findOne(id: number) {
    const account = await this.db.account.findUnique({
      where: {
        id: id,
      },
    });
    if (!account) {
      throw new NotFoundException(`account with id ${id} is not found`);
    }
  }

  update(id: number, updateAccountDto: UpdateAccountDto) {
    return `This action updates a #${id} account`;
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
