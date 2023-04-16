import {
  OnQueueActive,
  OnQueueCompleted,
  OnQueueError,
  Process,
  Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bull';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import { MessagingService } from 'src/messaging/messaging.service';

export const findTodayClassRomJobToken = 'find-today-classroom';

type Payload = {
  firstClass: string;
  secondClass: string;
  period: Date;
  matricula: string | number;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

@Processor(findTodayClassRomJobToken)
export class FindTodayClassRoomJob {
  private logger = new Logger(FindTodayClassRoomJob.name);

  constructor(
    private readonly config: ConfigService,
    private readonly messagingService: MessagingService,
  ) {}

  async initializeBrowser() {
    const args: string[] = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--window-position=0,0',
      '--ignore-certifcate-errors',
      '--ignore-certifcate-errors-spki-list',
      '--user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3312.0 Safari/537.36"',
    ];

    return puppeteer.launch({
      headless: true,
      executablePath: '/usr/bin/google-chrome',
      args,
    });
  }

  @Process()
  async process(): Promise<Payload> {
    try {
      const browser = await this.initializeBrowser();

      const page = await browser.newPage();

      await page.goto(process.env.PORT_USER_URL, { waitUntil: 'networkidle2' });

      await delay(3000);

      this.logger.log('Go to portal page');

      await page.type(
        '#User',
        String(this.config.get<string>('PORTAL_USER_LOGIN')),
        {
          delay: 150,
        },
      );
      this.logger.log('making login... user');

      await page.type(
        '#Pass',
        this.config.get<string>('PORTAL_PASSWORD_LOGIN'),
        {
          delay: 150,
        },
      );

      console.log('making login... password');

      await page.click(
        'body > div.container > div.login-box.animated.fadeInDown > form > div:nth-child(4) > input[type=submit]',
      );

      await page.waitForNavigation({ waitUntil: 'networkidle2' });

      console.log('clicking login button...');

      await delay(2000);

      await page.waitForFunction(
        () => !document.querySelector('#loading-screen'),
      );

      await page.click('#btnConfirmar');

      await delay(2000);

      await page.goto(
        'https://cyborg.ucsal.br/FrameHTML/web/app/edu/PortalEducacional/#/calendario',
        { waitUntil: 'networkidle2' },
      );

      await delay(1000);

      await page.waitForFunction(
        () => !document.querySelector('#loading-screen'),
      );

      await delay(1000);

      const button = await page.$('.k-view-agenda');

      await button.click();

      const html = await page.evaluate(() => document.body.innerHTML);

      await browser.close();

      const $ = cheerio.load(html);

      const classes = $('.k-task.ng-scope')
        .map((_, element) => element?.attribs['title'])
        .get();

      const payload = {
        firstClass: classes[0],
        secondClass: classes[1],
        matricula: this.config.get<string>('PORTAL_USER_LOGIN'),
        period: new Date(),
      } satisfies Payload;

      return payload;
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  @OnQueueActive()
  async onActive(job: any) {
    console.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueError()
  async error(any, error) {
    this.logger.error(JSON.stringify({ any, error }));
  }

  @OnQueueCompleted()
  async getTodayClassRoom(job: Job) {
    const payload = job.returnvalue as Payload;

    await this.messagingService.notifyNewClassRoomToday(payload);
  }
}
