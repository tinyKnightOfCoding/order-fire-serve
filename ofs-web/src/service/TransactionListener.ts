import {TransactionDto} from '../api/Client.ts';
import {deserializeCommand} from '../model/Command.ts';
import {snapshotRepository} from './SnapshotRepository.ts';
import {localStore} from './LocalStore.ts';

export class TransactionListener {

    private static INSTANCE: TransactionListener | null = null

    static instance(): TransactionListener {
        if(this.INSTANCE === null) this.INSTANCE = new TransactionListener()
        return this.INSTANCE
    }

    private ws: WebSocket | null = null
    private isRunning: boolean = false

    private constructor() {
    }

    start() {
        this.isRunning = true
        this.ws = new WebSocket(`ws://localhost:8080/transactions/ws`)
        this.ws.onopen = console.log
        this.ws.onerror = console.log
        this.ws.onmessage = (e) => {
            const transaction: TransactionDto = JSON.parse(e.data)
            this.applyTransaction(transaction)
        }
        this.ws.onclose = () => {
            if (this.isRunning) this.start()
        }
    }

    stop() {
        this.isRunning = false
        if(this.ws) this.ws.close()
    }

    applyTransaction(transaction: TransactionDto) {
        const commands = transaction.commands.map(dto => deserializeCommand(dto))
        commands.forEach(command => command.apply())
        snapshotRepository.setTransactionId(transaction.id)
        localStore.applyRemote(commands)
    }
}

export const transactionListener = TransactionListener.instance()