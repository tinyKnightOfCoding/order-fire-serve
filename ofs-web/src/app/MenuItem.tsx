import {useEffect, useState} from 'react';

type MenuItemsProps = {
    item: MenuItemInstance
}

function useDerivedState<T>(state: T) {
    const [name, setName] = useState(state)
    useEffect(() => setName(state), [state])
    return [name, setName] as const
}

const MenuItem = observer(({item}: MenuItemsProps) => {
    const [price, setPrice] = useDerivedState(item.price)
    const [name, setName] = useDerivedState(item.name)

    function deleteItem() {
        localStore.applyLocal(MenuItemDeleteCommand.create(item))
    }


    const save = () => {
        localStore.applyLocal(MenuItemPatchCommand.create(item, name, price))
    }

    const debouncedSave = useDebouncedCallback(save, 500)

    const handleNameChange = (e) => {
        const value = e.target.value
        setName(value)
        debouncedSave()
    }

    const handlePriceChange = (e) => {
        const value = +e.target.value
        setPrice(value)
        debouncedSave()
    }

    return (<li><input className="muted-input" type="text" value={name} onChange={handleNameChange}/> - <input className="muted-input" type="number" value={price} onChange={handlePriceChange}/><button type="button" onClick={deleteItem}>DEL</button></li>)
})

import {MenuItemInstance} from '../model/Model.ts';
import {localStore} from '../service/LocalStore.ts';
import {MenuItemDeleteCommand, MenuItemPatchCommand} from '../model/Command.ts';
import {useDebouncedCallback} from 'use-debounce';
import {observer, useLocalObservable, useObserver} from 'mobx-react';

export default MenuItem