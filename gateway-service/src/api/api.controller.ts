import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { KafkaService } from '../messaging/kafka.service';
import { DocumentModel, parseDocument } from './models/document.model';
import { map } from 'rxjs/operators';
import { CreateOrderDto } from './dto/create-order-.dto';
import { RefreshOrderTrakingDto } from './dto/refresh-order-traking.dto';
import { Order, parseOrder } from './models/order.model';

@Controller({
  version: 'v1',
  path: 'api/commics',
})
export class ApiController {
  constructor(private readonly kafkaService: KafkaService) {}

  @Get('find-all-unread')
  async findAllUnread() {
    return this.kafkaService
      .send('document.findAllWithUnfollowStatus', {})
      .pipe(map((response: DocumentModel[]) => response.map(parseDocument)));
  }

  @Patch(':id/update')
  async updateCommicChpaterStatus(
    @Param('id') id: string,
    @Body('chapter') chapter?: number,
  ) {
    this.kafkaService.emit('document.markAsRead', {
      id,
      chapter,
    });
  }

  @Get(':id')
  async getCommic(@Param('id') id: string) {
    return this.kafkaService
      .send('document.getById', { id })
      .pipe(map(({ document }) => parseDocument(document)));
  }
}
