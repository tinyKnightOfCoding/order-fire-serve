package ch.tinyknightofcoding.ofs

import ch.tinyknightofcoding.ofs.model.transaction.Transaction
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TransactionRepository : JpaRepository<Transaction, UUID> {

    @Query("select max(t.id) from Transaction t")
    fun getHeadId(): UUID?

    @Query("select t from Transaction  t where t.id > :lastKnownId order by t.id")
    fun seek(lastKnownId: UUID, pageable: Pageable): List<Transaction>
}
