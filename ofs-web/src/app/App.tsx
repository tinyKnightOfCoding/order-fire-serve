import MenuItems from './MenuItems.tsx';
import {LocalStateContext, localStore} from '../service/LocalStore.ts';
import AddMenuItem from './AddMenuItem.tsx';

function App() {

    return (
        <LocalStateContext.Provider value={localStore.state}>
            <main>
                <h1>Menu</h1>
                <MenuItems></MenuItems>
                <AddMenuItem></AddMenuItem>
            </main>
        </LocalStateContext.Provider>
    )
}

export default App
