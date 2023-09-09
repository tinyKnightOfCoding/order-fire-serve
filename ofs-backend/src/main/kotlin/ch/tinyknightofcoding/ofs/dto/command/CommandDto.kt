package ch.tinyknightofcoding.ofs.dto.command

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.util.UUID

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.PROPERTY, property = "commandType")
@JsonSubTypes(
    JsonSubTypes.Type(name = "MENU_ITEM_CREATE", value = MenuItemCreateCommandDto::class),
)
sealed interface CommandDto {
    val id: UUID
    val targetId: UUID
}
