package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.Message;
import com.chatapplication.core.entities.enums.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    Page<Message> findByRoomIdOrderBySentAtDesc(UUID roomId, Pageable pageable);

    List<Message> findByRoomIdAndStatus(UUID roomId, MessageStatus status);

    List<Message> findByRoomIdAndSenderId(UUID roomId, UUID senderId);
}