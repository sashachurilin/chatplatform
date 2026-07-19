package com.chatapplication.core.entities;

import com.chatapplication.core.entities.enums.ActivityType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class UserActivity {

    @Id
    private UUID id;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    private String roomId;

    private String ipAddress;

    private String userAgent;

    private Instant createdAt;

}
