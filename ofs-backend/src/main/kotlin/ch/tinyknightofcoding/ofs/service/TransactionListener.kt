package ch.tinyknightofcoding.ofs.service

import ch.tinyknightofcoding.ofs.model.transaction.Transaction

interface TransactionListener {

    fun afterCommit(transaction: Transaction)
}
