package com.chatapplication.core.dtos;

import com.chatapplication.core.entities.enums.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRoomResponse {

    private UUID id;
    private String name;
    private RoomType type;
    private Instant createdAt;
    private int participantCount;
    private String userRole;
}
