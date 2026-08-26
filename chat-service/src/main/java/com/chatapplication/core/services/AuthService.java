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

    private String generateUserTag(String username) {
        String baseTag = "user" + System.currentTimeMillis() % 100000;
        if (userRepository.findByUserTag(baseTag).isEmpty()) {
            return baseTag;
        }
        return username.toLowerCase().replaceAll("[^a-z0-9]", "") + "01";
    }

    private void logActivity(AppUser user, ActivityType type) {
        log.info("Пользователь {} выполнил действие: {}", user.getUsername(), type);
    }
}
