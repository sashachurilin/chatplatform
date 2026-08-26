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
    public AppUser updateProfile(UUID userId, String username, String userTag, String bio, String avatarUrl) {
        AppUser user = getById(userId);

        if (username != null) {
            if (userRepository.findByUsername(username).isPresent()
                    && !username.equals(user.getUsername())) {
                throw new IllegalArgumentException("Имя пользователя уже занято: " + username);
            }
            user.setUsername(username);
        }

        if (userTag != null) {
            if (userRepository.findByUserTag(userTag).isPresent()
                    && !userTag.equals(user.getUserTag())) {
                throw new IllegalArgumentException("UserTag уже занят: " + userTag);
            }
            user.setUserTag(userTag);
        }

        if (bio != null) {
            user.setBio(bio);
        }

        if (avatarUrl != null) {
            user.setAvatarUrl(avatarUrl);
        }

        user.setStatus(UserStatus.ONLINE);
        return userRepository.save(user);
    }
}
