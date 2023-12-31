package ch.tinyknightofcoding.ofs.web

import org.springframework.http.ResponseEntity

fun <T> ok(body: T): ResponseEntity<T> {
    return ResponseEntity.ok(body)
}

fun noContent(): ResponseEntity<Unit> {
    return ResponseEntity.noContent().build()
}
