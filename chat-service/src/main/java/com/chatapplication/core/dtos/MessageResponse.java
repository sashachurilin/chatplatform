package com.chatapplication.core.dtos;

import com.chatapplication.core.entities.enums.MessageStatus;
import com.chatapplication.core.entities.enums.MessageType;
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
public class MessageResponse {

    private UUID id;
    private String content;
    private UUID senderId;
    private String senderUsername;
    private MessageType messageType;
    private MessageStatus messageStatus;
    private String fileUrl;
    private String fileName;
    private Instant sentAt;
}
