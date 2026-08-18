package com.chatapplication.core.controllers;

import com.chatapplication.core.dtos.MessageResponse;
import com.chatapplication.core.entities.enums.MessageType;
import com.chatapplication.core.security.ChatUserAuthentication;
import com.chatapplication.core.services.ChatRoomService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@Slf4j
public class MessageController {

    private final ChatRoomService chatRoomService;

    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/rooms/{roomId}")
    public MessageResponse sendMessage(
            Authentication authentication,
            @DestinationVariable String roomId,
            @Payload Map<String, Object> payload) {

        UUID userId = extractUserId(authentication);
        String content = (String) payload.get("content");
        MessageType messageType = MessageType.valueOf(
                payload.getOrDefault("messageType", "TEXT").toString());

        log.info("WebSocket: отправка сообщения в комнату {} от пользователя {}", roomId, userId);

        return chatRoomService.sendMessage(
                UUID.fromString(roomId), userId, content, messageType);
    }

    private UUID extractUserId(Authentication authentication) {
        if (authentication instanceof ChatUserAuthentication chatAuth) {
            return chatAuth.getUserId();
        }
        throw new RuntimeException("Пользователь не авторизован");
    }
}
