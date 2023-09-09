package ch.tinyknightofcoding.ofs.model.command

import jakarta.persistence.Column
import jakarta.persistence.Entity
import java.math.BigDecimal
import java.util.UUID

@Entity
class MenuItemCreateCommand(
    id: UUID,
    targetId: UUID,
    @Column(nullable = false)
    val name: String,
    @Column(nullable = false)
    val price: BigDecimal,
) : Command(id, targetId)
