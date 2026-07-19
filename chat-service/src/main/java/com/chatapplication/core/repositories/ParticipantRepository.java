package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.Participant;
import com.chatapplication.core.entities.enums.ParticipantRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<Participant, UUID> {

    @Query("SELECT p FROM Participant p WHERE p.appUser.id = :userId AND p.chatRoom.id = :roomId")
    Optional<Participant> findByUserIdAndRoomId(@Param("userId") UUID userId, @Param("roomId") UUID roomId);

    @Query("SELECT p FROM Participant p WHERE p.chatRoom.id = :roomId")
    List<Participant> findByRoomId(@Param("roomId") UUID roomId);

    @Query("SELECT p FROM Participant p WHERE p.appUser.id = :userId")
    List<Participant> findByUserId(@Param("userId") UUID userId);

    @Query("SELECT p FROM Participant p WHERE p.chatRoom.id = :roomId AND p.role = :role")
    List<Participant> findByRoomIdAndRole(@Param("roomId") UUID roomId, @Param("role") ParticipantRole role);

    @Query("SELECT CASE WHEN COUNT(p) > 0 THEN true ELSE false END FROM Participant p WHERE p.appUser.id = :userId AND p.chatRoom.id = :roomId")
    boolean existsByUserIdAndRoomId(@Param("userId") UUID userId, @Param("roomId") UUID roomId);
}