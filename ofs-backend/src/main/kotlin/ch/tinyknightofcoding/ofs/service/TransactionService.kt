package ch.tinyknightofcoding.ofs.service

import ch.tinyknightofcoding.ofs.TransactionRepository
import ch.tinyknightofcoding.ofs.generateUuid
import ch.tinyknightofcoding.ofs.model.transaction.Transaction
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Service
import org.springframework.transaction.support.TransactionSynchronization
import org.springframework.transaction.support.TransactionSynchronizationManager

@Service
class TransactionService(
    val repository: TransactionRepository,
    val transactionListeners: List<TransactionListener>,
) {

    fun <R> runInTransactionContext(run: context(TransactionContext) () -> R): R {
        repository.acquireLock()
        val previousId = repository.getHeadId()
        val ctx = TransactionContext(generateUuid(), previousId)
        val result = run(ctx)
        val transaction = repository.save(ctx.toTransaction())
        TransactionSynchronizationManager.registerSynchronization(
            TransactionNotifier(
                transaction,
                transactionListeners,
            ),
        )
        return result
    }
}

private class TransactionNotifier(
    val transaction: Transaction,
    val listeners: List<TransactionListener>,
) : TransactionSynchronization {

    override fun afterCommit() {
        listeners.forEach { listener ->
            try {
                listener.afterCommit(transaction)
            } catch (ex: Exception) {
                log.warn("error occurred in TransactionListener <{}>", listener, ex)
            }
        }
    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(TransactionNotifier::class.java)
    }
}
