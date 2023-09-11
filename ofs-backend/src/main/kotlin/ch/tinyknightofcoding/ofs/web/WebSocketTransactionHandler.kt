package ch.tinyknightofcoding.ofs.web

import ch.tinyknightofcoding.ofs.model.transaction.Transaction
import ch.tinyknightofcoding.ofs.service.TransactionListener
import com.fasterxml.jackson.databind.ObjectMapper
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler

@Component
class WebSocketTransactionHandler(val mapper: ObjectMapper) : TextWebSocketHandler(), TransactionListener {

    private val activeSessions = mutableSetOf<WebSocketSession>()

    override fun afterConnectionEstablished(session: WebSocketSession) {
        activeSessions.add(session)
    }

    override fun afterConnectionClosed(session: WebSocketSession, closeStatus: CloseStatus) {
        activeSessions.remove(session)
    }

    override fun handleTransportError(session: WebSocketSession, exception: Throwable) {
        log.warn("transport error", exception)
    }

    override fun afterCommit(transaction: Transaction) {
        val payload = mapper.writeValueAsString(transaction.toDto())
        val msg = TextMessage(payload)
        for (activeSession in activeSessions) {
            try {
                if (activeSession.isOpen) activeSession.sendMessage(msg)
            } catch (ex: Exception) {
                log.warn("could not send message", ex)
            }
        }
    }

    companion object {
        val log: Logger = LoggerFactory.getLogger(WebSocketTransactionHandler::class.java)
    }
}
