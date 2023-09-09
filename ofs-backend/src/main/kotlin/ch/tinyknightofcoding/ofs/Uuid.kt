package ch.tinyknightofcoding.ofs

import com.github.f4b6a3.uuid.UuidCreator
import java.util.UUID

fun UUID?.orGenerate(): UUID = this ?: UuidCreator.getTimeOrderedEpoch()

fun UUID?.orNil(): UUID = this ?: UuidCreator.getNil()

fun generateUuid(): UUID = UuidCreator.getTimeOrderedEpoch()
