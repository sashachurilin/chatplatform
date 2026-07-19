package com.chatapplication.core.entities;

import com.chatapplication.core.entities.enums.ParticipantRole;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Data
@Entity
public class Participant {

    @Id
    private UUID id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom chatRoom;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser appUser;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ParticipantRole role;

    private Instant joinedAt;

    private UUID chatRoomId() {
        return Optional.ofNullable(chatRoom).map(ChatRoom::getId).orElse(null);
    }

    private UUID appUserId() {
        return Optional.ofNullable(appUser).map(AppUser::getId).orElse(null);
    }
}
