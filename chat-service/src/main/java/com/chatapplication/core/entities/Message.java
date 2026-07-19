package com.chatapplication.core.entities;

import com.chatapplication.core.entities.enums.MessageStatus;
import com.chatapplication.core.entities.enums.MessageType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Data
@Entity
public class Message {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String content;

    @ManyToOne
    private Participant sender;

    @ManyToOne
    private ChatRoom chatRoom;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageType messageType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MessageStatus messageStatus;

    private String fileUrl;

    private String fileName;

    private Instant sentAt;

    private Instant deliveredAt;

    private Instant readAt;

    private Instant updatedAt;

    private Instant deletedAt;

    private UUID participantID() {
        return Optional.ofNullable(sender).map(Participant::getId).orElse(null);
    }

    private UUID chatRoomID() {
        return Optional.ofNullable(chatRoom).map(ChatRoom::getId).orElse(null);
    }

}
