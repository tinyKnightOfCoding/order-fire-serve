import {localStore} from './LocalStore.ts';
import {applyPatch, applySnapshot} from 'mobx-state-tree';
import {snapshotRepository} from './SnapshotRepository.ts';
import {seekTransactions} from '../api/Client.ts';
import {transactionListener} from './TransactionListener.ts';
import {updateQueue} from './UpdateQueue.ts';

export async function startUp() {
    // load persistent
    applySnapshot(localStore.state, snapshotRepository.getSnapshot())
    // load transactions from server
    let transactions = await seekTransactions(snapshotRepository.getTransactionId())
    while(transactions.length > 0) {
        transactions.forEach(transactionListener.applyTransaction)
        transactions = await seekTransactions(snapshotRepository.getTransactionId())
    }
    applyPatch(localStore.state, updateQueue.patches)
    transactionListener.start()
}