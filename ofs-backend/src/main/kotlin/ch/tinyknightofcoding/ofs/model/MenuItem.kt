package ch.tinyknightofcoding.ofs.model

import ch.tinyknightofcoding.ofs.BaseModel
import jakarta.persistence.Column
import jakarta.persistence.Entity
import java.math.BigDecimal
import java.util.UUID

@Entity
class MenuItem(
    id: UUID,
    @Column(nullable = false)
    var name: String,
    @Column(nullable = false)
    var price: BigDecimal,
) : BaseModel(id)
