package ch.tinyknightofcoding.ofs

import jakarta.persistence.Id
import jakarta.persistence.MappedSuperclass
import java.util.UUID

@MappedSuperclass
class BaseModel(
    @Id
    val id: UUID,
)
