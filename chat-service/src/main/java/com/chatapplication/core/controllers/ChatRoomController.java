package com.chatapplication.core.controllers;

import com.chatapplication.core.dtos.ChatRoomResponse;
import com.chatapplication.core.dtos.MessageResponse;
import com.chatapplication.core.entities.enums.MessageType;
import com.chatapplication.core.entities.enums.RoomType;
import com.chatapplication.core.security.ChatUserAuthentication;
import com.chatapplication.core.services.ChatRoomService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
@Slf4j
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    @PostMapping
    public ResponseEntity<ChatRoomResponse> createRoom(
            Authentication authentication,
            @RequestParam String name,
            @RequestParam(defaultValue = "PUBLIC") RoomType type) {
        log.info("Создание комнаты: {}", name);
        UUID userId = parseUserId(authentication);
        ChatRoomResponse room = chatRoomService.createRoom(userId, name, type);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<ChatRoomResponse> joinRoom(
            Authentication authentication,
            @PathVariable UUID roomId) {
        log.info("Вступление в комнату: {}", roomId);
        UUID userId = parseUserId(authentication);
        ChatRoomResponse room = chatRoomService.joinRoom(userId, roomId);
        return ResponseEntity.ok(room);
    }

    @DeleteMapping("/{roomId}/leave")
    public ResponseEntity<Void> leaveRoom(
            Authentication authentication,
            @PathVariable UUID roomId) {
        log.info("Выход из комнаты: {}", roomId);
        UUID userId = parseUserId(authentication);
        chatRoomService.leaveRoom(userId, roomId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{roomId}")
    public ResponseEntity<ChatRoomResponse> getRoom(
            Authentication authentication,
            @PathVariable UUID roomId) {
        UUID userId = parseUserId(authentication);
        ChatRoomResponse room = chatRoomService.getRoomInfo(roomId, userId);
        return ResponseEntity.ok(room);
    }

    @GetMapping
    public ResponseEntity<List<ChatRoomResponse>> getUserRooms(Authentication authentication) {
        UUID userId = parseUserId(authentication);
        log.info("Получение списка комнат для пользователя: {}", userId);
        List<ChatRoomResponse> rooms = chatRoomService.getUserRooms(userId);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping("/{roomId}/messages")
    public ResponseEntity<MessageResponse> sendMessage(
            Authentication authentication,
            @PathVariable UUID roomId,
            @RequestParam String content,
            @RequestParam(defaultValue = "TEXT") MessageType messageType) {
        log.info("Отправка сообщения в комнату: {}", roomId);
        UUID userId = parseUserId(authentication);
        MessageResponse message = chatRoomService.sendMessage(roomId, userId, content, messageType);
        return ResponseEntity.status(HttpStatus.CREATED).body(message);
    }

    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<MessageResponse>> getMessages(
            Authentication authentication,
            @PathVariable UUID roomId,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "50") int size) {
        UUID userId = parseUserId(authentication);
        chatRoomService.getRoomInfo(roomId, userId);
        log.info("Загрузка сообщений комнаты {} (страница: {}, размер: {})", roomId, page, size);
        List<MessageResponse> messages = chatRoomService.getRoomMessages(roomId, page, size);
        return ResponseEntity.ok(messages);
    }

    private UUID parseUserId(Authentication authentication) {
        if (authentication instanceof ChatUserAuthentication chatAuth) {
            return chatAuth.getUserId();
        }
        throw new RuntimeException("Пользователь не авторизован");
    }
}
