import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
    constructor(
      private readonly configService: ConfigService,
      @Inject(NOTIFICATIONS_SERVICE) private readonly notificationsClient: ClientProxy,
    ) {}
    private readonly stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY'), {
      apiVersion: '2025-05-28.basil',
    });

    async createCharge({ card, amount, email }: PaymentsCreateChargeDto) {
      try {
        const charge = await this.stripe.paymentIntents.create({
          amount: amount*100,
          currency: 'usd',
          payment_method: 'pm_card_visa',
          confirm: true,
          return_url: 'http://localhost:3000'
        });
        this.notificationsClient.emit('notify_email', {
          email,
          text: `$${amount} has been charged`,
        });
        return charge;
      } catch (er) {
        console.log(er)
      }
    }
}
