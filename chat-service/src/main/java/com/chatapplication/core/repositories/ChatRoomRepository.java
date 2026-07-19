package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.ChatRoom;
import com.chatapplication.core.entities.enums.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {

    @Query("SELECT cr FROM ChatRoom cr WHERE cr.type = :type")
    List<ChatRoom> findByType(@Param("type") RoomType type);

    @Query("SELECT cr FROM ChatRoom cr WHERE LOWER(cr.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ChatRoom> findByNameContainingIgnoreCase(@Param("name") String name);

    @Query("SELECT CASE WHEN COUNT(cr) > 0 THEN true ELSE false END FROM ChatRoom cr WHERE cr.name = :name")
    boolean existsByName(@Param("name") String name);

    @Query("SELECT cr FROM ChatRoom cr JOIN Participant p ON p.chatRoom.id = cr.id WHERE p.appUser.id = :userId")
    List<ChatRoom> findUserRooms(@Param("userId") UUID userId);
}