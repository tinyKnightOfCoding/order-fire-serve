package ch.tinyknightofcoding.ofs.web

import ch.tinyknightofcoding.ofs.MenuItemRepository
import ch.tinyknightofcoding.ofs.dto.menu_item.MenuItemCreateDto
import ch.tinyknightofcoding.ofs.dto.menu_item.MenuItemDto
import ch.tinyknightofcoding.ofs.model.MenuItem
import ch.tinyknightofcoding.ofs.model.command.MenuItemCreateCommand
import ch.tinyknightofcoding.ofs.orGenerate
import ch.tinyknightofcoding.ofs.service.MenuItemService
import ch.tinyknightofcoding.ofs.service.TransactionService
import org.springframework.http.ResponseEntity
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.UUID

@Transactional
@RestController
@RequestMapping("/menu-items")
class MenuItemController(
    val service: MenuItemService,
    val repository: MenuItemRepository,
    val transactionService: TransactionService,
) {

    @GetMapping
    fun getAll(): ResponseEntity<List<MenuItemDto>> {
        val menuItems = repository.findAll().map { it.toDto() }
        return ok(menuItems)
    }

    @PutMapping("/{menuItemId}")
    fun create(
        @PathVariable menuItemId: UUID,
        @RequestHeader(name = "OFS-Command-ID", required = false) commandId: UUID?,
        @RequestBody
        body: MenuItemCreateDto,
    ): ResponseEntity<MenuItemDto> = transactionService.runInTransactionContext {
        val command = MenuItemCreateCommand(commandId.orGenerate(), menuItemId, body.name, body.price)
        val menuItem = service.create(command)
        commandExecuted(command)
        ok(menuItem.toDto())
    }
}

fun MenuItem.toDto(): MenuItemDto {
    return MenuItemDto(id, name, price)
}
