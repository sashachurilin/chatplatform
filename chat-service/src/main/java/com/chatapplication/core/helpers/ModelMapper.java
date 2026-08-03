package com.chatapplication.core.helpers;

import com.chatapplication.core.entities.*;
import com.chatapplication.core.entities.enums.MessageStatus;
import com.chatapplication.core.entities.enums.MessageType;
import com.chatapplication.core.entities.enums.ParticipantRole;
import com.chatapplication.core.entities.enums.RoomType;
import com.chatapplication.core.entities.enums.UserStatus;

import java.time.Instant;
import java.util.UUID;

public class ModelMapper {

    private ModelMapper() {}

    public static AppUser createAppUser(String username, String email) {
        AppUser user = new AppUser();
        user.setId(UUID.randomUUID());
        user.setUsername(username);
        user.setEmail(email);
        user.setUserTag(generateUserTag());
        user.setStatus(UserStatus.OFFLINE);
        user.setCreatedAt(Instant.now());
        user.setTotalOnlineTime(0L);
        return user;
    }

    public static ChatRoom createChatRoom(String name, RoomType type) {
        ChatRoom room = new ChatRoom();
        room.setId(UUID.randomUUID());
        room.setName(name);
        room.setType(type);
        room.setCreatedAt(Instant.now());
        room.setUpdatedAt(Instant.now());
        return room;
    }

    public static Participant createParticipant(ChatRoom room, AppUser user, ParticipantRole role) {
        Participant participant = new Participant();
        participant.setId(UUID.randomUUID());
        participant.setChatRoom(room);
        participant.setAppUser(user);
        participant.setRole(role);
        participant.setJoinedAt(Instant.now());
        return participant;
    }

    public static Message createMessage(ChatRoom room, Participant sender, String content) {
        Message message = new Message();
        message.setId(UUID.randomUUID());
        message.setChatRoom(room);
        message.setSender(sender);
        message.setContent(content);
        message.setMessageType(MessageType.TEXT);
        message.setMessageStatus(MessageStatus.SENT);
        message.setSentAt(Instant.now());
        return message;
    }

    private static String generateUserTag() {
        return "user" + (int)(Math.random() * 100000);
    }
}
