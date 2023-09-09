package ch.tinyknightofcoding.ofs.dto.menu_item

import java.math.BigDecimal

data class MenuItemCreateDto(
    val name: String,
    val price: BigDecimal,
)
