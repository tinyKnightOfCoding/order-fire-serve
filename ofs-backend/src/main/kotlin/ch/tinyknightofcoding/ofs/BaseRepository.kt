package ch.tinyknightofcoding.ofs

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.repository.NoRepositoryBean
import java.util.UUID

@NoRepositoryBean
interface BaseRepository<E : BaseModel> : JpaRepository<E, UUID>
