package com.chatapplication.core.services;

import com.chatapplication.core.dtos.ChatRoomResponse;
import com.chatapplication.core.dtos.MessageResponse;
import com.chatapplication.core.entities.*;
import com.chatapplication.core.entities.enums.MessageType;
import com.chatapplication.core.entities.enums.MessageStatus;
import com.chatapplication.core.entities.enums.ParticipantRole;
import com.chatapplication.core.entities.enums.RoomType;
import com.chatapplication.core.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    public ChatRoomResponse createRoom(UUID userId, String name, RoomType type) {
        log.info("Создание комнаты '{}' пользователем {}", name, userId);

        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + userId));

        if (chatRoomRepository.existsByName(name)) {
            log.warn("Комната с таким именем уже существует: {}", name);
            throw new IllegalArgumentException("Комната с таким именем уже существует: " + name);
        }

        ChatRoom room = new ChatRoom();
        room.setId(UUID.randomUUID());
        room.setName(name);
        room.setType(type);
        room.setCreatedAt(Instant.now());
        room.setUpdatedAt(Instant.now());
        room = chatRoomRepository.save(room);

        addParticipantInternal(room.getId(), userId, ParticipantRole.CREATOR);

        log.info("Комната {} создана", room.getId());
        return toRoomResponse(room, userId);
    }

    public ChatRoomResponse joinRoom(UUID userId, UUID roomId) {
        log.info("Пользователь {} вступает в комнату {}", userId, roomId);

        if (participantRepository.existsByUserIdAndRoomId(userId, roomId)) {
            log.warn("Пользователь уже является участником комнаты: {}", roomId);
            throw new IllegalArgumentException("Вы уже являетесь участником этой комнаты");
        }

        addParticipantInternal(roomId, userId, ParticipantRole.MEMBER);
        log.info("Пользователь {} вступил в комнату {}", userId, roomId);
        return getRoomInfo(roomId, userId);
    }

    public void leaveRoom(UUID userId, UUID roomId) {
        log.info("Пользователь {} выходит из комнаты {}", userId, roomId);

        Participant participant = participantRepository.findByUserIdAndRoomId(userId, roomId)
                .orElseThrow(() -> new RuntimeException("Вы не являетесь участником этой комнаты"));

        if (participant.getRole() == ParticipantRole.CREATOR) {
            log.warn("Создатель не может покинуть комнату: {}", roomId);
            throw new IllegalArgumentException("Создатель не может покинуть свою комнату. Удалите её.");
        }

        participantRepository.delete(participant);
        log.info("Пользователь {} вышел из комнаты {}", userId, roomId);
    }

    public ChatRoomResponse getRoomInfo(UUID roomId, UUID userId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Комната не найдена: " + roomId));
        return toRoomResponse(room, userId);
    }

    public List<ChatRoomResponse> getUserRooms(UUID userId) {
        List<ChatRoomResponse> rooms = chatRoomRepository.findUserRooms(userId).stream()
                .map(room -> toRoomResponse(room, userId))
                .toList();
        log.info("Пользователь {} получил список комнат (всего: {})", userId, rooms.size());
        return rooms;
    }

    public MessageResponse sendMessage(UUID roomId, UUID senderUserId, String content, MessageType messageType) {
        log.info("Отправка сообщения в комнату {} от пользователя {}", roomId, senderUserId);

        Participant sender = participantRepository.findByUserIdAndRoomId(senderUserId, roomId)
                .orElseThrow(() -> new RuntimeException("Вы не являетесь участником этой комнаты"));

        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Комната не найдена: " + roomId));

        Message message = new Message();
        message.setId(UUID.randomUUID());
        message.setContent(content);
        message.setSender(sender);
        message.setChatRoom(room);
        message.setMessageType(messageType != null ? messageType : MessageType.TEXT);
        message.setMessageStatus(MessageStatus.SENT);
        message.setSentAt(Instant.now());
        message = messageRepository.save(message);

        log.info("Сообщение {} отправлено в комнату {}", message.getId(), roomId);
        return toMessageResponse(message);
    }

    public List<MessageResponse> getRoomMessages(UUID roomId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("sentAt").descending());
        List<MessageResponse> messages = messageRepository.findByRoomId(roomId, pageable).getContent().stream()
                .map(this::toMessageResponse)
                .toList();
        log.info("Получено {} сообщений для комнаты {}", messages.size(), roomId);
        return messages;
    }

    private void addParticipantInternal(UUID roomId, UUID userId, ParticipantRole role) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Комната не найдена: " + roomId));
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + userId));

        Participant participant = new Participant();
        participant.setId(UUID.randomUUID());
        participant.setChatRoom(room);
        participant.setAppUser(user);
        participant.setRole(role);
        participant.setJoinedAt(Instant.now());
        participantRepository.save(participant);
    }

    private ChatRoomResponse toRoomResponse(ChatRoom room, UUID currentUserId) {
        ParticipantRole userRole = participantRepository.findByUserIdAndRoomId(currentUserId, room.getId())
                .map(Participant::getRole)
                .orElse(null);

        return ChatRoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .type(room.getType())
                .createdAt(room.getCreatedAt())
                .participantCount(room.getParticipants() != null ? room.getParticipants().size() : 0)
                .userRole(userRole != null ? userRole.name() : null)
                .build();
    }

    private MessageResponse toMessageResponse(Message message) {
        return MessageResponse.builder()
                .id(message.getId())
                .content(message.getContent())
                .senderId(message.getSender() != null ? message.getSender().getId() : null)
                .senderUsername(message.getSender() != null && message.getSender().getAppUser() != null
                        ? message.getSender().getAppUser().getUsername() : null)
                .messageType(message.getMessageType())
                .messageStatus(message.getMessageStatus())
                .fileUrl(message.getFileUrl())
                .fileName(message.getFileName())
                .sentAt(message.getSentAt())
                .build();
    }
}
