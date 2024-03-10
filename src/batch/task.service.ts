import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(private schedulerRegistry: SchedulerRegistry) {
    this.addCronJob();
  }
  //@Cron('* * * * * *', { name: 'cronTask' })
  handleCron() {
    this.logger.log('Task Called');
  }

  //@Interval('intervalTask', 3000)
  handleInterval() {
    this.logger.log('3 second task called');
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run! ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job);

    this.logger.log(`job ${name} added!`);
  }
}
