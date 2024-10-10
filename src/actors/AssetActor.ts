import { Temporal } from 'dapr-client';
import { AbstractActor } from "@dapr/dapr";


export interface IMyActor {
  start(params: MyActorParams): Promise<void>;
  stop(): Promise<void>;
}

interface MyActorParams {
  name: string;
}

export class MyActor extends AbstractActor implements IMyActor {
  private timerName = 'ActorTimer';
  private callback = 'ActorFnCallbackCounter';
  private duePeriod = new Temporal.Duration(0);
  private durationPeriod = new Temporal.Duration(0, 0, 0, 0, 0, 0, 10);
  private params: MyActorParams = { name: '' };
  private counter: number = 0;

  async start(params: MyActorParams): Promise<void> {
    this.params = params;
    console.log(`Starting actor ${this.getActorId()}`);
    await this.registerActorTimer(this.timerName, this.callback, this.duePeriod, this.durationPeriod);
  }

  async stopSimulation(): Promise<void> {
    console.log(`Stopping actor ${this.getActorId()}`);
    await this.unregisterActorTimer(this.timerName);
  }

  async ActorFnCallbackCounter(): Promise<void> {
    try {
      console.log(`Actor timer call back - counter: ${this.counter}, actorId: ${this.getActorId()}`);
      this.counter++;

    } catch (error) {
      console.log(`error in actor ${this.getActorId()} ${error}`)
    }
  }
}


