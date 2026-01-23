import { Injectable } from '@nestjs/common';

@Injectable()
export class BatchService {
  public getHello(): string {
    return 'Welcome to Nestar Batch server!';
  }

  public async batchRollback(): Promise<void> {
    console.log("batchRollback")
  }

  public async batchTopProperties(): Promise<void> {
    console.log("batchTopProperties")
  }

  public async batchTopAgents(): Promise<void> {
    console.log("batchTopAgents")
  }
}
