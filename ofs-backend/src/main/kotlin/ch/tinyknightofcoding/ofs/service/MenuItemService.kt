package ch.tinyknightofcoding.ofs.service

import ch.tinyknightofcoding.ofs.MenuItemRepository
import ch.tinyknightofcoding.ofs.model.MenuItem
import ch.tinyknightofcoding.ofs.model.command.MenuItemCreateCommand
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
}
