import {observer} from 'mobx-react';
import {FormEvent, useState} from 'react';
import {localStore} from '../service/LocalStore.ts';
import {MenuItemCreateCommand} from '../model/Command.ts';

const AddMenuItem = observer(() => {
    const [name, setName] = useState('')
    function submit(e: FormEvent) {
        e.preventDefault()
        if(name.length > 0) {
            localStore.applyLocal(MenuItemCreateCommand.create(name, 11.30))
            setName('')
        }
    }
    return (
        <form onSubmit={(e) => submit(e)}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
        </form>
    )
})

export default AddMenuItem