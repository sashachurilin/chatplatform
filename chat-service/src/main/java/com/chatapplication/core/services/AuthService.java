package com.chatapplication.core.services;

import com.chatapplication.core.dtos.AuthResponse;
import com.chatapplication.core.dtos.LoginRequest;
import com.chatapplication.core.dtos.RegisterRequest;
import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.entities.enums.ActivityType;
import com.chatapplication.core.entities.enums.UserStatus;
import com.chatapplication.core.repositories.UserActivityRepository;
import com.chatapplication.core.repositories.UserRepository;
import com.chatapplication.core.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final UserActivityRepository userActivityRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        log.info("Начало регистрации пользователя: {}", request.getUsername());

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            log.warn("Имя пользователя уже занято: {}", request.getUsername());
            throw new IllegalArgumentException("Имя пользователя уже занято: " + request.getUsername());
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            log.warn("Email уже зарегистрирован: {}", request.getEmail());
            throw new IllegalArgumentException("Email уже зарегистрирован: " + request.getEmail());
        }

        String userTag = generateUserTag(request.getUsername());

        AppUser user = new AppUser();
        user.setId(UUID.randomUUID());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserTag(userTag);
        user.setStatus(UserStatus.ONLINE);
        user.setCreatedAt(Instant.now());
        user.setLastLogin(Instant.now());

        user = userRepository.save(user);

        logActivity(user, ActivityType.REGISTERED);

        String token = jwtUtil.generateToken(user.getId());

        log.info("Пользователь {} успешно зарегистрирован", request.getUsername());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(token)
                .expiresIn(jwtUtil.extractExpiration(token).getTime() - System.currentTimeMillis())
                .user(AuthResponse.UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .userTag(user.getUserTag())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .bio(user.getBio())
                        .build())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Попытка входа: {}", request.getUsernameOrEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsernameOrEmail(),
                        request.getPassword()
                )
        );

        AppUser user = userRepository.findByUsername(request.getUsernameOrEmail())
                .or(() -> userRepository.findByEmail(request.getUsernameOrEmail()))
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        user.setStatus(UserStatus.ONLINE);
        user.setLastLogin(Instant.now());
        userRepository.save(user);

        logActivity(user, ActivityType.LOGIN);

        String token = jwtUtil.generateToken(user.getId());

        log.info("Пользователь {} успешно вошёл в систему", user.getUsername());

        return AuthResponse.builder()
                .accessToken(token)
                .refreshToken(token)
                .expiresIn(jwtUtil.extractExpiration(token).getTime() - System.currentTimeMillis())
                .user(AuthResponse.UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .userTag(user.getUserTag())
                        .email(user.getEmail())
                        .avatarUrl(user.getAvatarUrl())
                        .bio(user.getBio())
                        .build())
                .build();
    }

    public void logout(UUID userId) {
        log.info("Выход пользователя: {}", userId);

        userRepository.findById(userId).ifPresent(user -> {
            user.setStatus(UserStatus.OFFLINE);
            userRepository.save(user);
            logActivity(user, ActivityType.LOGOUT);
            log.info("Пользователь {} вышел из системы", user.getUsername());
        });
    }

    public AuthResponse.UserResponse updateProfile(UUID userId, com.chatapplication.core.dtos.UpdateProfileRequest request) {
        log.info("Обновление профиля пользователя: {}", userId);

        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Пользователь не найден"));

        if (request.getUsername() != null && !request.getUsername().isBlank()) {
            user.setUsername(request.getUsername().trim());
        }

        if (request.getUserTag() != null && !request.getUserTag().isBlank()) {
            String newTag = request.getUserTag().trim();
            final UUID currentId = user.getId();
            userRepository.findByUserTag(newTag).ifPresent(existing -> {
                if (!existing.getId().equals(currentId)) {
                    throw new IllegalArgumentException("Тег уже занят: " + newTag);
                }
            });
            user.setUserTag(newTag);
        }

        user = userRepository.save(user);
        log.info("Пользователь {} обновил тег на: {}", user.getUsername(), user.getUserTag());

        return AuthResponse.UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .userTag(user.getUserTag())
                .email(user.getEmail())
                .build();
    }

    private String generateUserTag(String username) {
        long randomNum = 10000L + (System.currentTimeMillis() % 90000L);
        String baseTag = String.valueOf(randomNum);
        if (userRepository.findByUserTag(baseTag).isEmpty()) {
            return baseTag;
        }
        return String.valueOf(10000L + (long)(Math.random() * 90000L));
    }

    private void logActivity(AppUser user, ActivityType type) {
        log.info("Пользователь {} выполнил действие: {}", user.getUsername(), type);
    }
}
