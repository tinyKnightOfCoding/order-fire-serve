import {Command} from '../model/Command.ts';
import {IJsonPatch} from 'mobx-state-tree';

export class UpdateQueue {

    private static INSTANCE: UpdateQueue | null = null

    static instance(): UpdateQueue {
        if(this.INSTANCE == null) this.INSTANCE = new UpdateQueue();
        return this.INSTANCE
    }

    readonly commands: Command[] = [];

    private constructor() {
    }

    queue(command: Command) {
        this.commands.push(command)
        setTimeout(() => this.resolveTop())
    }

    get patches(): IJsonPatch[] {
        return this.commands.flatMap(c => c.patches)
    }

    private resolveTop() {
        const command = this.commands.shift()
        if(command === undefined) return
        command.execute().then(() => setTimeout(() => this.resolveTop()), (err) => {
            console.log(err)
            // TODO revoke
            setTimeout(() => this.resolveTop())
        })
    }
}

export const updateQueue = UpdateQueue.instance()