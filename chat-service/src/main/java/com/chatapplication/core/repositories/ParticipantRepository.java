package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.Participant;
import com.chatapplication.core.entities.enums.ParticipantRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ParticipantRepository extends JpaRepository<Participant, UUID> {

    Optional<Participant> findByUserIdAndRoomId(UUID userId, UUID roomId);

    List<Participant> findByRoomId(UUID roomId);

    List<Participant> findByUserId(UUID userId);

    List<Participant> findByRoomIdAndRole(UUID roomId, ParticipantRole role);

    boolean existsByUserIdAndRoomId(UUID userId, UUID roomId);
}