package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.ChatRoom;
import com.chatapplication.core.entities.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {

    List<ChatRoom> findByType(RoomType type);

    List<ChatRoom> findByNameContainingIgnoreCase(String name);

    boolean existsByName(String name);
}
