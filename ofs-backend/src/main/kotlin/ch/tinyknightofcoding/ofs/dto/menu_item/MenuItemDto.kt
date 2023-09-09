package ch.tinyknightofcoding.ofs.dto.menu_item

import java.math.BigDecimal
import java.util.UUID

data class MenuItemDto(
    val id: UUID,
    val name: String,
    val price: BigDecimal,
)
