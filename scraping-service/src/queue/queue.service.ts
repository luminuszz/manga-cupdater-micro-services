import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import {
  CheckWithExistsNewChapterDto,
  findComicCapByUrlJobToken,
} from './jobs/find-comic-cap-by-url';

import {
  FindSerieEpisodeJobData,
  findSerieEpisodeJobToken,
} from './jobs/find-serie-episode';
import { findTodayClassRomJobToken } from './jobs/find-today-classroom';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(findComicCapByUrlJobToken)
    private readonly findComicCapByUrlQueue: Queue<CheckWithExistsNewChapterDto>,
    @InjectQueue(findTodayClassRomJobToken)
    private readonly findTodayClassRomQueue: Queue<void>,
    @InjectQueue(findSerieEpisodeJobToken)
    private readonly findSerieEpisodeQueue: Queue<FindSerieEpisodeJobData>,
  ) {}

  async addComicCapByUrlQueue(data: CheckWithExistsNewChapterDto) {
    await this.findComicCapByUrlQueue.add(data, {
      removeOnComplete: true,
    });
  }

  async addFindTodayClassRomQueue() {
    await this.findTodayClassRomQueue.add(null, { removeOnComplete: true });
  }

  async addFindSerieEpisodeQueue(data: FindSerieEpisodeJobData) {
    await this.findSerieEpisodeQueue.add(data, { removeOnComplete: true });
  }
}
