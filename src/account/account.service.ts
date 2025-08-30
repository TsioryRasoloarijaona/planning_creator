import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { findAccount } from './dto/find-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { DatabaseService } from 'src/database/database.service';
import { hashPassword } from 'src/utils/crypto.util';
import { createAccountRequest } from './dto/create-account-request.dto';
import { generatePassword } from 'src/utils/password-ganerator.util';
import { CreateAccountDto } from './dto/create-account.dto';
import { createAccountResDto } from './dto/create--account-res.dto';
import { MailService } from 'src/mail/mail.service';
import { SendAccountCreatedDto } from 'src/mail/dto/send-account.dto';

@Injectable()
export class AccountService {
  constructor(
    private readonly db: DatabaseService,
    private readonly mail: MailService,
  ) {}
  async create(
    createAccount: createAccountRequest,
  ): Promise<createAccountResDto> {
    if (await this.findByEmail(createAccount.email)) {
      throw new ConflictException(`${createAccount.email} is already taken`);
    }

    const front = process.env.FRONT_URL || '';
    const generatedPassword = generatePassword();
    const encryptedPwd = await hashPassword(generatedPassword);

    const newAccount: CreateAccountDto = {
      name: createAccount.name,
      email: createAccount.email,
      password: encryptedPwd,
      role: createAccount.role,
    };

    const createdAccount = await this.db.account.create({ data: newAccount });

    const emailData: SendAccountCreatedDto = {
      to: createAccount.email,
      fullName: createAccount.name,
      loginUrl: front,
      tempPassword: generatedPassword,
      email: createAccount.email,
    };

    try {
      await this.mail.sendAccountCreated(emailData); 
    } catch (err) {
      console.error('mail send failed:', err?.response || err?.message || err);
    }

    return {
      id: createdAccount.id,
      name: createdAccount.name,
      email: createdAccount.email,
      password: generatedPassword, // ⚠️ à éviter en prod; afficher une seule fois côté admin
      role: createdAccount.role,
    };
  }

  async createMany(createAccount: createAccountRequest[]) {
    let data: createAccountResDto[] = [];
    for (let i = 0; i < createAccount.length; i++) {
      const encryptedPwd = await hashPassword('securePassword123');
      const newAccount: CreateAccountDto = {
        name: createAccount[i].name,
        email: createAccount[i].email,
        password: encryptedPwd,
        role: createAccount[i].role,
      };
      const createdAccount = await this.db.account.create({
        data: newAccount,
      });

      data.push({
        id: createdAccount.id,
        name: createdAccount.name,
        email: createdAccount.email,
        password: 'securePassword123',
        role: createdAccount.role,
      });
    }
    return data;
  }

  async findAll(page = 1): Promise<{ data: findAccount[]; total: number }> {
    const take = 10;
    const skip = (page - 1) * take;

    const [data, total] = await Promise.all([
      this.db.account.findMany({
        skip,
        take,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      }),
      this.db.account.count(),
    ]);

    return { data, total };
  }

  async findFilter(q: string) {
    try {
      const accounts = await this.db.account.findMany({
        where: {
          OR: [
            {
              name: {
                contains: q,
              },
            },
            {
              email: {
                contains: q,
              },
            },
          ],
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return accounts;
    } catch (error) {}
  }

  async findOne(id: number) {
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

  async updatePassword(id: number, newPwd: string) {
    try {
      const hashedPwd = await hashPassword(newPwd);
      return await this.db.account.update({
        where: {
          id: id,
        },
        data: {
          password: hashedPwd,
        },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} account`;
  }
}
