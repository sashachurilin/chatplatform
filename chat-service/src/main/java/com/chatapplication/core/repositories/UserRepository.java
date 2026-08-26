package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.entities.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByUsername(String username);

    Optional<AppUser> findByEmail(String email);

    List<AppUser> findByStatus(UserStatus status);

    Optional<AppUser> findByUserTag(String userTag);

    Optional<AppUser> findByUsernameAndPassword(String username, String password);

    @Query("SELECT u FROM AppUser u WHERE LOWER(u.userTag) LIKE LOWER(CONCAT(:tag, '%')) AND u.deletedAt IS NULL")
    List<AppUser> findByUserTagContainingIgnoreCase(@Param("tag") String tag);
}
