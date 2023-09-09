package ch.tinyknightofcoding.ofs.model.transaction

import ch.tinyknightofcoding.ofs.model.command.Command
import com.github.f4b6a3.uuid.UuidCreator
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderColumn
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.util.UUID

// @EntityListeners(PreventUpdateListener::class)
@Entity
@Table(name = "transaction", uniqueConstraints = [UniqueConstraint(columnNames = ["previousId"])])
class Transaction private constructor(
    @Id
    val id: UUID,
    @Column(nullable = false)
    val previousId: UUID,
    @OrderColumn(name = "index", updatable = false, nullable = false)
    @OneToMany(cascade = [CascadeType.ALL])
    @JoinColumn(name = "transaction_id", nullable = false, updatable = false)
    val commands: List<Command>,
) {

    companion object {
        fun create(previousId: UUID, commands: List<Command>): Transaction {
            return Transaction(UuidCreator.getTimeOrderedEpoch(), previousId, commands)
        }
    }
}
