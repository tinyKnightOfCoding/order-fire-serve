import {RestaurantState, RestaurantStateInstance} from '../model/Model.ts';
import {Command} from '../model/Command.ts';
import {applyPatch, IJsonPatch} from 'mobx-state-tree';
import {updateQueue} from './UpdateQueue.ts';
import React, {useContext} from 'react';
import {snapshotRepository} from './SnapshotRepository.ts';

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

    revokeLocal(command: Command) {
        const menuItemRemoteSnapshot = snapshotRepository.getMenuItem(command.targetId)
        const resetPatch: IJsonPatch = menuItemRemoteSnapshot !== null ? {
            op: "add",
            path: command.entityPath,
            value: menuItemRemoteSnapshot
        } : { op: "remove", path: command.entityPath}
        applyPatch(this.state, [resetPatch, ...updateQueue.patches])
    }
}

export const localStore = LocalStore.instance()

export const LocalStateContext = React.createContext<RestaurantStateInstance | undefined>(undefined)

export function useLocalState(): RestaurantStateInstance {
    const state = useContext(LocalStateContext)
    if(!state) throw Error("no local state found")
    return state
}
