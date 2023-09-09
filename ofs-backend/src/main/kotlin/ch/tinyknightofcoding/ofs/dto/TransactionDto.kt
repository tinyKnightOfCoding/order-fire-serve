package ch.tinyknightofcoding.ofs.dto

import ch.tinyknightofcoding.ofs.dto.command.CommandDto
import java.util.UUID

data class TransactionDto(
    val id: UUID,
    val previousId: UUID,
    val commands: List<CommandDto>,
)
