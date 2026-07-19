package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.entities.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<AppUser, UUID> {

    Optional<AppUser> findByUsername(String username);

    Optional<AppUser> findByEmail(String email);

    List<AppUser> findByStatus(UserStatus status);

    Optional<AppUser> findByUserTag(String userTag);

    Optional<AppUser> findByUsernameAndPassword(String username, String password);
}
