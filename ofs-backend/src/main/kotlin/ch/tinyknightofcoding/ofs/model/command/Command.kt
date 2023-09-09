package ch.tinyknightofcoding.ofs.model.command

import ch.tinyknightofcoding.ofs.model.PreventUpdateListener
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.Id
import jakarta.persistence.Inheritance
import jakarta.persistence.InheritanceType
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.util.UUID

@Entity
@Table(name = "transaction_command", uniqueConstraints = [UniqueConstraint(columnNames = ["transaction_id", "index"])])
@Inheritance(strategy = InheritanceType.JOINED)
@EntityListeners(PreventUpdateListener::class)
abstract class Command(
    @Id
    val id: UUID,
    @Column(nullable = false)
    val targetId: UUID,
)
