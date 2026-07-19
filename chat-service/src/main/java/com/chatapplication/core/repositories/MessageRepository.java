package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.Message;
import com.chatapplication.core.entities.enums.MessageStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :roomId ORDER BY m.sentAt DESC")
    Page<Message> findByRoomId(@Param("roomId") UUID roomId, Pageable pageable);

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :roomId AND m.messageStatus = :status")
    List<Message> findByRoomIdAndStatus(@Param("roomId") UUID roomId, @Param("status") MessageStatus status);

    @Query("SELECT m FROM Message m WHERE m.chatRoom.id = :roomId AND m.sender.id = :senderId")
    List<Message> findByRoomIdAndSenderId(@Param("roomId") UUID roomId, @Param("senderId") UUID senderId);
}