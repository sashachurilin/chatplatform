package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.UserActivity;
import com.chatapplication.core.entities.enums.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface UserActivityRepository extends JpaRepository<UserActivity, UUID> {

    List<UserActivity> findByUserIdOrderByCreatedAtDesc(UUID userId);

    List<UserActivity> findByUserIdAndTypeOrderByCreatedAtDesc(UUID userId, ActivityType type);
}
