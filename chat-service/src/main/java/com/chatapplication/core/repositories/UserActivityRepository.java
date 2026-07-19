package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.UserActivity;
import com.chatapplication.core.entities.enums.ActivityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface UserActivityRepository extends JpaRepository<UserActivity, UUID> {

    @Query("SELECT ua FROM UserActivity ua WHERE ua.appUser.id = :userId ORDER BY ua.createdAt DESC")
    List<UserActivity> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);

    @Query("SELECT ua FROM UserActivity ua WHERE ua.appUser.id = :userId AND ua.type = :type ORDER BY ua.createdAt DESC")
    List<UserActivity> findByUserIdAndTypeOrderByCreatedAtDesc(@Param("userId") UUID userId, @Param("type") ActivityType type);

    // ✅ Дополнительные методы
    @Query("SELECT ua FROM UserActivity ua WHERE ua.appUser.id = :userId AND ua.createdAt BETWEEN :start AND :end ORDER BY ua.createdAt DESC")
    List<UserActivity> findByUserIdAndCreatedAtBetween(@Param("userId") UUID userId, @Param("start") Instant start, @Param("end") Instant end);

    @Query("SELECT ua FROM UserActivity ua WHERE ua.type = :type")
    List<UserActivity> findByType(@Param("type") ActivityType type);
}