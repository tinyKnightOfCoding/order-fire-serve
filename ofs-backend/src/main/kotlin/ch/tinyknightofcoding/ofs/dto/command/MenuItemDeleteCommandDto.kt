package ch.tinyknightofcoding.ofs.dto.command

import java.util.UUID

data class MenuItemDeleteCommandDto(
    override val id: UUID,
    override val targetId: UUID,
) : CommandDto
