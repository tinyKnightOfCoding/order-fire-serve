package ch.tinyknightofcoding.ofs.service

import ch.tinyknightofcoding.ofs.model.command.Command
import ch.tinyknightofcoding.ofs.model.transaction.Transaction
import java.util.UUID

class TransactionContext(val id: UUID, val previousId: UUID?) {
    private val commands = mutableListOf<Command>()

    fun commandExecuted(command: Command) {
        this.commands += command
    }

    fun toTransaction() = Transaction.create(id, previousId, commands.toList())
}
