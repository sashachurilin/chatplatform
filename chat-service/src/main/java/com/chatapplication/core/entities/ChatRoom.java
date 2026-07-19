package com.chatapplication.core.entities;

import com.chatapplication.core.entities.enums.RoomType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.Id;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
@Entity
public class ChatRoom {

    @Id
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RoomType type;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant deletedAt;

    @OneToMany
    private List<Participant> participants;
}
