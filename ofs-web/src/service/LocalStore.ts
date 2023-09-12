import {RestaurantState, RestaurantStateInstance} from '../model/Model.ts';
import {Command} from '../model/Command.ts';
import {applyPatch} from 'mobx-state-tree';
import {updateQueue} from './UpdateQueue.ts';
import React, {useContext} from 'react';

export class LocalStore {

    private static INSTANCE: LocalStore | null = null

    static instance(): LocalStore {
        if(this.INSTANCE === null) this.INSTANCE = new LocalStore()
        return this.INSTANCE
    }

    readonly state: RestaurantStateInstance = RestaurantState.create()

    private constructor() {
    }

    applyRemote(commands: Command[]) {
        const remotePatches = commands.flatMap(c => c.patches)
        const localPatches = updateQueue.patches
        // remote first
        applyPatch(this.state, [...remotePatches, ...localPatches])
    }

    applyLocal(command: Command) {
        updateQueue.queue(command)
        applyPatch(this.state, command.patches)
    }
}

export const localStore = LocalStore.instance()

export const LocalStateContext = React.createContext<RestaurantStateInstance | undefined>(undefined)

export function useLocalState(): RestaurantStateInstance {
    const state = useContext(LocalStateContext)
    if(!state) throw Error("no local state found")
    return state
}
