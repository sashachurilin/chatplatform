package com.chatapplication.core.services;

import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.entities.enums.UserStatus;
import com.chatapplication.core.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public AppUser getById(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден: " + id));
    }

    public AppUser getByUserTag(String userTag) {
        return userRepository.findByUserTag(userTag)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден по тегу: " + userTag));
    }

    public List<AppUser> searchByUserTag(String userTag) {
        return userRepository.findByUserTagContainingIgnoreCase(userTag);
    }

    @Transactional
    public AppUser updateUsername(UUID userId, String username) {
        AppUser user = getById(userId);

        if (userRepository.findByUsername(username).isPresent()
                && !username.equals(user.getUsername())) {
            throw new IllegalArgumentException("Имя пользователя уже занято: " + username);
        }

        user.setUsername(username);
        return userRepository.save(user);
    }

    @Transactional
    public AppUser updateUserTag(UUID userId, String userTag) {
        AppUser user = getById(userId);

        if (userRepository.findByUserTag(userTag).isPresent()
                && !userTag.equals(user.getUserTag())) {
            throw new IllegalArgumentException("UserTag уже занят: " + userTag);
        }

        user.setUserTag(userTag);
        return userRepository.save(user);
    }

    @Transactional
    public AppUser updateBio(UUID userId, String bio) {
        AppUser user = getById(userId);
        user.setBio(bio);
        return userRepository.save(user);
    }

    @Transactional
    public AppUser updateAvatar(UUID userId, String avatarUrl) {
        AppUser user = getById(userId);
        user.setAvatarUrl(avatarUrl);
        return userRepository.save(user);
    }

    @Transactional
    public AppUser deleteAvatar(UUID userId) {
        AppUser user = getById(userId);
        user.setAvatarUrl(null);
        return userRepository.save(user);
    }

    @Transactional
    public AppUser updateEmail(UUID userId, String newEmail) {
        AppUser user = getById(userId);

        if (userRepository.findByEmail(newEmail).isPresent()
                && !newEmail.equals(user.getEmail())) {
            throw new IllegalArgumentException("Email уже занят: " + newEmail);
        }

        user.setEmail(newEmail);
        return userRepository.save(user);
    }
}