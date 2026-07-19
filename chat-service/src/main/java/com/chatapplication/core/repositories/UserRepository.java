package com.chatapplication.core.repositories;

import com.chatapplication.core.entities.User;
import com.chatapplication.core.entities.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> findByStatus(UserStatus status);

    Optional<User> findByUserTag(String userTag);

    Optional<User> findByUsernameAndPassword(String username, String password);
}
