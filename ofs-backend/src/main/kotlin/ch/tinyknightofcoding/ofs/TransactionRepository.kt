package ch.tinyknightofcoding.ofs

import ch.tinyknightofcoding.ofs.model.transaction.Transaction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface TransactionRepository : JpaRepository<Transaction, UUID>
