package ch.tinyknightofcoding.ofs.model

import jakarta.persistence.PrePersist
import jakarta.persistence.PreRemove
import jakarta.persistence.PreUpdate

class PreventUpdateListener {

    @PrePersist
    fun onPrePersist(entity: Any) {
    }

    @PreUpdate
    fun onPreUpdate(entity: Any) {
        throw IllegalStateException("cannot update $entity")
    }

    @PreRemove
    fun onPreRemove(entity: Any) {
        throw IllegalStateException("cannot remove $entity")
    }
}
