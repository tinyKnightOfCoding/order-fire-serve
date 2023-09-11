package ch.tinyknightofcoding.ofs.model.command

import jakarta.persistence.Column
import jakarta.persistence.Entity
import java.math.BigDecimal
import java.util.UUID

@Entity
class MenuItemPatchCommand(
    id: UUID,
    targetId: UUID,
    @Column(nullable = false)
    val nameChanged: Boolean,
    @Column
    val name: String?,
    @Column(nullable = false)
    val priceChanged: Boolean,
    @Column
    val price: BigDecimal?,
) : Command(id, targetId)
