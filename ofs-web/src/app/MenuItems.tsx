import {observer} from 'mobx-react';
import {useLocalState} from '../service/LocalStore.ts';
import {MenuItemInstance} from '../model/Model.ts';
import MenuItem from './MenuItem.tsx';

const MenuItems = observer(() => {
    const items: MenuItemInstance[] = useLocalState().menuItems
    return (
        <ul>
            {items.map(item => (<MenuItem key={item.id} item={item}></MenuItem>))}
        </ul>
    )
})

export default MenuItems