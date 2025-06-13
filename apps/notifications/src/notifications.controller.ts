import { Controller, UsePipes } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  
  @UsePipes(new ValidationPipe())
  @EventPattern('notify_email')
  notifyEmail(@Payload() notifyEmailDto: NotifyEmailDto) {
    this.notificationsService.notifyEmail(notifyEmailDto);
  }
}
