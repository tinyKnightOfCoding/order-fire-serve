package ch.tinyknightofcoding.ofs.web

import ch.tinyknightofcoding.ofs.TransactionRepository
import ch.tinyknightofcoding.ofs.dto.TransactionDto
import ch.tinyknightofcoding.ofs.dto.command.CommandDto
import ch.tinyknightofcoding.ofs.dto.command.MenuItemCreateCommandDto
import ch.tinyknightofcoding.ofs.dto.command.MenuItemDeleteCommandDto
import ch.tinyknightofcoding.ofs.dto.command.MenuItemPatchCommandDto
import ch.tinyknightofcoding.ofs.model.command.Command
import ch.tinyknightofcoding.ofs.model.command.MenuItemCreateCommand
import ch.tinyknightofcoding.ofs.model.command.MenuItemDeleteCommand
import ch.tinyknightofcoding.ofs.model.command.MenuItemPatchCommand
import ch.tinyknightofcoding.ofs.model.transaction.Transaction
import ch.tinyknightofcoding.ofs.orNil
import org.springframework.data.domain.Pageable
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@Transactional
@RestController
@RequestMapping("/transactions")
class TransactionController(
    val transactionRepository: TransactionRepository,
) {

    @GetMapping
    fun seek(@RequestParam lastKnownId: UUID?, @RequestParam size: Int?): ResponseEntity<List<TransactionDto>> {
        val transactions = this.transactionRepository.seek(lastKnownId.orNil(), Pageable.ofSize(size ?: 50))
        return ok(transactions.map { it.toDto() })
    }
}

fun Transaction.toDto(): TransactionDto {
    return TransactionDto(id, previousId, commands.map { it.toDto() })
}

fun Command.toDto(): CommandDto = when (this) {
    is MenuItemCreateCommand -> MenuItemCreateCommandDto(id, targetId, name, price)
    is MenuItemPatchCommand -> MenuItemPatchCommandDto(id, targetId, name, price)
    is MenuItemDeleteCommand -> MenuItemDeleteCommandDto(id, targetId)
    else -> throw UnsupportedOperationException("unknown type ${this::class.qualifiedName}")
}
