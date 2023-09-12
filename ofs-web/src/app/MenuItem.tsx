import {useEffect, useState} from 'react';

type MenuItemsProps = {
    item: MenuItemInstance
}

const MenuItem = observer(({item}: MenuItemsProps) => {
    console.log(item, item.name, item.price)
    const [name, setName] = useState(item.name)
    useEffect(() => setName(item.name), [item.name])
    const [price, setPrice] = useState(item.price)
    useEffect(() => setPrice(item.price), [item.price])

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
import {observer} from 'mobx-react';

export default MenuItem