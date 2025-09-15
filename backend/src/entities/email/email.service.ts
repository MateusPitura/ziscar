import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmail } from './email.type';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendEmail({ body, title, to, html }: SendEmail) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: title,
        text: body,
        html,
      });
    } catch (error) {
      console.log('error', error);
      console.error('❌ Cannot send the email');
    }
  }
}
