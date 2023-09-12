import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './app/App.tsx';
import {startUp} from './service/StartUp.ts';

function react() {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
}

startUp().then(() => react())