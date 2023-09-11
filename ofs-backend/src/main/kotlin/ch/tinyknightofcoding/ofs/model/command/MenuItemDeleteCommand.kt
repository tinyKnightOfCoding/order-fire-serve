package ch.tinyknightofcoding.ofs.model.command

import jakarta.persistence.Entity
import java.util.UUID

@Entity
class MenuItemDeleteCommand(id: UUID, targetId: UUID) : Command(id, targetId)
