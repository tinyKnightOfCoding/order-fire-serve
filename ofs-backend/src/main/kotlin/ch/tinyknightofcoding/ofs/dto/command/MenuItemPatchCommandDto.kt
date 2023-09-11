package ch.tinyknightofcoding.ofs.dto.command

import java.math.BigDecimal
import java.util.UUID

data class MenuItemPatchCommandDto(
    override val id: UUID,
    override val targetId: UUID,
    val name: String?,
    val price: BigDecimal?,
) : CommandDto
