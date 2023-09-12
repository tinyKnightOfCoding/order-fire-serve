import {MenuItemSnapshot, RestaurantStateSnapshot} from '../model/Model.ts';

export class SnapshotRepository {

    private static INSTANCE: SnapshotRepository | null = null;

    static instance(): SnapshotRepository {
        if(this.INSTANCE == null) this.INSTANCE = new SnapshotRepository();
        return this.INSTANCE
    }

    private _transactionId: string | null
    private _snapshot: RestaurantStateSnapshot

    private constructor() {
        this._transactionId = localStorage.getItem('snapshotTransactionId')
        const s = localStorage.getItem('snapshot')
        this._snapshot = s ? JSON.parse(s) : { menu: {} }
    }

    getTransactionId(): string | null {
        return this._transactionId;
    }

    getMenuItem(id: string): MenuItemSnapshot | null {
        const menu = this._snapshot?.menu
        return menu ? menu[id] : null
    }

    setMenuItem(menuItem: MenuItemSnapshot) {
        this._snapshot.menu[menuItem.id] = menuItem
        localStorage.setItem('snapshot', JSON.stringify(this._snapshot))
    }

    deleteMenuItem(id: string) {
        delete this._snapshot.menu[id]
    }

    setTransactionId(transactionId: string) {
        this._transactionId = transactionId
        localStorage.setItem('snapshotTransactionId', this._transactionId)
    }

    getSnapshot(): RestaurantStateSnapshot {
        return this._snapshot
    }
}

export const snapshotRepository = SnapshotRepository.instance()