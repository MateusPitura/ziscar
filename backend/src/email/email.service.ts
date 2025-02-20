import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailInDto } from './email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail({ body, title, to }: SendEmailInDto) {
    await this.mailerService.sendMail({
      to,
      subject: title,
      text: body,
    });
  }
}
