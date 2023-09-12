import {Instance, SnapshotOut, types} from 'mobx-state-tree';

export const MenuItem = types.model({
    id: types.identifier,
    name: types.string,
    price: types.number,
})

export type MenuItemInstance = Instance<typeof MenuItem>

export type MenuItemSnapshot = SnapshotOut<typeof MenuItem>

export const RestaurantState = types.model({
    menu: types.map(MenuItem)
}).views(self => ({
    get menuItems(): MenuItemInstance[] {
        return [...self.menu.values()]
    }
}))

export type RestaurantStateInstance = Instance<typeof RestaurantState>

export type RestaurantStateSnapshot = SnapshotOut<typeof RestaurantState>