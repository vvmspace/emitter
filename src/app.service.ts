import { Injectable } from '@nestjs/common';
import { IRecord } from './interfaces/IRecord';
import { Client } from '@jdiamond/mqtt';
import { actions, isStorable } from './actions/actions';
import { isApprovable } from './actions/approvable';
import { getId } from './utils/getId';
import { genFrom } from './app.constants';

import { runner } from './actions.runner';
import { IState, IStateWrapper, StateWrapper } from './utils/state';
import { nano } from './utils/microtime';
import { log } from './utils/log';

let FROM: string;

@Injectable()
export class AppService {
  private mqtt: Client;
  private state: any;
  private stateWrapper: IStateWrapper;
  private getId: () => string = getId;
  private readonly report: (msg: string) => void;

  constructor() {
    FROM = genFrom();
    this.state = {};
    this.stateWrapper = new StateWrapper(FROM, async (state: IState) => {
      // if(!)
      if (!state) {
        return this.report('NO STATE');
      }
      if (state.lastAction > this.state?.lastAction) {
        this.state = state;
        this.publish('state', { state });
      }
      return this.report('STATE CALLBACK');
    });

    this.mqtt = new Client({
      url: `mqtt://${process.env.MQTT_HOST || 'mqtt.local'}`,
    });
    this.report = (msg) => {
      return (
        process.env.REPORT &&
        this.publish('report', {
          from: FROM,
          event: msg,
          time: nano(),
          state: this.state,
          action: 'report',
        })
      );
    };
    setTimeout(async () => {
      await this.stateWrapper.get().then(() => this.report('State loaded'));
      return await this.mqtt
        .connect()
        .then(async () => {
          await this.report('CONNECTED');
          await this.mqtt.subscribe('#');
          this.mqtt.on('message', async (topic, payloadString) => {
            // this.report(`EMIT ${topic}`);
            const run = actions.find((a) => a.action == topic)?.run || null;
            if (!run) {
              return;
            }
            payloadString.toString('utf-8');
            const payload = JSON.parse(payloadString);
            const myTransaction = payload.from == FROM;

            await this.stateWrapper.get();

            console.log('isStorable(topic): ', isStorable(topic));
            isStorable(topic) &&
              (await this.stateWrapper.get().then(async (state) => {
                console.log('STORABLE state: ', state);
                if (state) {
                  state.pending.push(payload);
                  await this.stateWrapper.set(state);
                }
              }));

            this.state = await runner(run, payload, this.state, FROM);
            console.log('this.state 2: ', this.state);
            console.log('FROM: ', FROM);
            if (!myTransaction && isApprovable(topic)) {
              const approvePayload = {
                id: this.getId(),
                action: 'approve',
                from: FROM,
                payloadFrom: payload.from,
                payload: {
                  from: FROM,
                  transaction: payload.id,
                },
              };
              this.report(`APPROVAL PAYLOAD ${topic}`);
              isApprovable(topic) &&
                !myTransaction &&
                (await this.publish('approve', approvePayload));
            }
          });
        })
        .catch((e) => log(e.message));
    }, Math.floor(Math.random() * 1000));

    setInterval(() => {
      setTimeout(async () => {
        FROM = 'popstas_' + genFrom();
        this.stateWrapper.setPrefix(FROM);
        await this.stateWrapper.get();
        // await this.publish('ping', {
        //   id: this.getId(),
        //   from: FROM,
        //   action: 'ping',
        //   time: nano(),
        // }).catch((e) => this.report(e.message || '500'));
      }, Math.floor(Math.random() * 2000));
    }, 30000);
  }

  publish(action: string, payload: any): any {
    if (typeof payload == 'string') {
      this.report(payload);
      console.log(action, payload, payload.length);
      return this.mqtt.publish(action, payload);
    }
    try {
      const payloadString = JSON.stringify(payload);
      this.report(payloadString);
      return this.mqtt.publish(action, payloadString);
    } catch (e) {
      this.report(e.message);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  emit(record: IRecord): any {
    this.report('EMITTING RECORD ' + record);
    const id = this.getId();
    const payload = {
      id,
      from: record.from || genFrom(),
      ...record,
      time: nano(),
    };
    this.publish(record.action, payload);
    return { action: record.action, payload };
  }
}
