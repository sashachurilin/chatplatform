package com.chatapplication.core.entities;

import com.chatapplication.core.entities.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class AppUser {

    @Id
    private UUID id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String userTag;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    private Instant createdAt;

    private Instant updatedAt;

    private Instant deletedAt;

    private Instant lastLogin;

    private Long totalOnlineTime;

    private String avatarUrl;

    private String bio;

    @PrePersist
    public void prePersist() {
        if (id == null) id = UUID.randomUUID();
        if (createdAt == null) createdAt = Instant.now();
        if (status == null) status = UserStatus.OFFLINE;
        if (totalOnlineTime == null) totalOnlineTime = 0L;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}