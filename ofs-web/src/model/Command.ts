import {
    CommandDto,
    deleteMenuItem,
    MenuItemCreateCommandDto,
    MenuItemDeleteCommandDto,
    MenuItemPatchCommandDto,
    patchMenuItem,
    putMenuItem,
} from '../api/Client.ts';
import {applyPatch, IJsonPatch} from 'mobx-state-tree';
import {MenuItem, MenuItemInstance} from './Model.ts';
import {snapshotRepository} from '../service/SnapshotRepository.ts';
import {uuidv7} from 'uuidv7';

export interface Command {
    readonly id: string
    readonly targetId: string
    readonly entityPath: string;
    readonly patches: IJsonPatch[];

    // calls backend
    execute(): Promise<void>;

    // updates snapshot repository
    apply(): void
}

export class MenuItemCreateCommand implements Command {
    static fromDto(dto: MenuItemCreateCommandDto): MenuItemCreateCommand {
        const entityPath: string = `/menu/${dto.targetId}`
        const addPatch: IJsonPatch = {
            op: 'add',
            path: entityPath,
            value: {
                id: dto.targetId,
                name: dto.name,
                price: dto.price
            }
        }
        return new MenuItemCreateCommand(dto.id, dto.targetId, entityPath, [addPatch], dto.name, dto.price)
    }

    static create(name: string, price: number): MenuItemCreateCommand {
        const targetId = uuidv7()
        const entityPath = `/menu/${targetId}`
        const addPatch: IJsonPatch = {
            op: 'add',
            path: entityPath,
            value: {
                id: targetId,
                name: name,
                price: price
            }
        }
        return new MenuItemCreateCommand(uuidv7(), targetId, entityPath, [addPatch], name, price)
    }

    private constructor(
        readonly id: string,
        readonly targetId: string,
        readonly entityPath: string,
        readonly patches: IJsonPatch[],
        readonly name: string,
        readonly price: number,
    ) {
    }

    execute(): Promise<void> {
        return putMenuItem({name: this.name, price: this.price}, this.targetId, this.id).then()
    }

    apply() {
        snapshotRepository.setMenuItem({id: this.targetId, name: this.name, price: this.price})
    }
}

export class MenuItemPatchCommand implements Command {

    static fromDto(dto: MenuItemPatchCommandDto): MenuItemPatchCommand {
        const entityPath: string = `/menu/${dto.targetId}`
        const replaceNamePatch: IJsonPatch | undefined = dto.name ? {
            op: 'replace',
            path: `${entityPath}/name`,
            value: dto.name
        } : undefined
        const replacePricePatch: IJsonPatch | undefined = dto.price ? {
            op: 'replace',
            path: `${entityPath}/price`,
            value: dto.price
        } : undefined
        const patches = [replaceNamePatch, replacePricePatch].filter(isDefined)
        return new MenuItemPatchCommand(dto.id, dto.targetId, entityPath, patches, dto.name, dto.price)
    }

    static create(menuItem: MenuItemInstance, name?: string, price?: number): MenuItemPatchCommand {
        const entityPath: string = `/menu/${menuItem.id}`
        const replaceNamePatch: IJsonPatch | undefined = name ? {
            op: 'replace',
            path: `${entityPath}/name`,
            value: name
        } : undefined
        const replacePricePatch: IJsonPatch | undefined = price ? {
            op: 'replace',
            path: `${entityPath}/price`,
            value: price
        } : undefined
        const patches = [replaceNamePatch, replacePricePatch].filter(isDefined)
        return new MenuItemPatchCommand(uuidv7(), menuItem.id, entityPath, patches, name, price)
    }

    private constructor(
        readonly id: string,
        readonly targetId: string,
        readonly entityPath: string,
        readonly patches: IJsonPatch[],
        readonly name?: string,
        readonly price?: number
    ) {
    }

    execute(): Promise<void> {
        return patchMenuItem({name: this.name, price: this.price}, this.targetId, this.id).then()
    }

    apply() {
        const snapshot = snapshotRepository.getMenuItem(this.targetId)
        if(!snapshot) return
        const item = MenuItem.create(snapshot)
        applyPatch(item, this.patches.map(p => ({...p, path: p.path.slice(this.entityPath.length)})))
        snapshotRepository.setMenuItem(item)
    }
}

export class MenuItemDeleteCommand implements Command {

    static fromDto(dto: MenuItemDeleteCommandDto): MenuItemDeleteCommand {
        const entityPath: string = `/menu/${dto.targetId}`
        const removePatch: IJsonPatch = {
            op: 'remove',
            path: entityPath,
        }
        return new MenuItemDeleteCommand(dto.id, dto.targetId, entityPath, [removePatch])
    }

    static create(menuItem: MenuItemInstance): MenuItemDeleteCommand {
        const entityPath = `/menu/${menuItem.id}`
        const removePatch: IJsonPatch = {
            op: 'remove',
            path: entityPath,
        }
        return new MenuItemDeleteCommand(uuidv7(), menuItem.id, entityPath, [removePatch])
    }

    private constructor(
        readonly id: string,
        readonly targetId: string,
        readonly entityPath: string,
        readonly patches: IJsonPatch[],
    ) {
    }

    execute(): Promise<void> {
        return deleteMenuItem(this.targetId, this.id).then()
    }

    apply() {
        snapshotRepository.deleteMenuItem(this.targetId)
    }
}

export function deserializeCommand(dto: CommandDto): Command {
    switch (dto.commandType) {
        case 'MENU_ITEM_CREATE': return MenuItemCreateCommand.fromDto(dto as MenuItemCreateCommandDto)
        case 'MENU_ITEM_PATCH': return MenuItemPatchCommand.fromDto(dto as MenuItemPatchCommandDto)
        case 'MENU_ITEM_DELETE': return MenuItemDeleteCommand.fromDto(dto as MenuItemDeleteCommandDto)
    }
}

function isDefined<T>(el: T | undefined | null): el is T {
    return el !== undefined && el !== null
}