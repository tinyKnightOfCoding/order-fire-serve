package ch.tinyknightofcoding.ofs.service

import ch.tinyknightofcoding.ofs.MenuItemRepository
import ch.tinyknightofcoding.ofs.model.MenuItem
import ch.tinyknightofcoding.ofs.model.command.MenuItemCreateCommand
import ch.tinyknightofcoding.ofs.model.command.MenuItemDeleteCommand
import ch.tinyknightofcoding.ofs.model.command.MenuItemPatchCommand
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class MenuItemService(val menuItemRepository: MenuItemRepository) {

    fun create(command: MenuItemCreateCommand): MenuItem {
        val menuItem = MenuItem(
            command.targetId,
            command.name,
            command.price,
        )
        return menuItemRepository.save(menuItem)
    }

    fun patch(command: MenuItemPatchCommand): MenuItem {
        if ("Spaghetti Carbonara mit Rahm".equals(command.name, ignoreCase = true)) throw IllegalStateException()
        val menuItem = menuItemRepository.findByIdOrNull(command.targetId) ?: throw IllegalStateException()
        if (command.nameChanged) {
            menuItem.name = command.name!!
        }
        if (command.priceChanged) {
            menuItem.price = command.price!!
        }
        return menuItemRepository.save(menuItem)
    }

    fun delete(command: MenuItemDeleteCommand) {
        menuItemRepository.deleteById(command.targetId)
    }
}
