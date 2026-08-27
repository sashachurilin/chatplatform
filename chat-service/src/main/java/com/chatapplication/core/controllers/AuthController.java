package com.chatapplication.core.controllers;

import com.chatapplication.core.dtos.AuthResponse;
import com.chatapplication.core.dtos.LoginRequest;
import com.chatapplication.core.dtos.RegisterRequest;
import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.repositories.UserRepository;
import com.chatapplication.core.security.JwtUtil;
import com.chatapplication.core.services.AuthService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Запрос на регистрацию: {}", request.getUsername());
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            log.warn("Регистрация не удалась: {}", e.getMessage());
            // Return conflict status with a clear message
            return ResponseEntity.status(HttpStatus.CONFLICT).body(java.util.Map.of("message", "Аккаунт уже существует в базе данных"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("Запрос на вход: {}", request.getUsernameOrEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        UUID userId = null;

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String subject = jwtUtil.extractSubject(token);
                userId = UUID.fromString(subject);
            } catch (Exception e) {
                log.warn("Недействительный токен при выходе");
            }
        }

        if (userId != null) {
            authService.logout(userId);
        }

        log.info("Выход из системы");
        return ResponseEntity.ok(Map.of("message", "Выход выполнен успешно"));
    }

    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserResponse> me(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String subject = jwtUtil.extractSubject(token);
                UUID userId = UUID.fromString(subject);
                AppUser user = userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Пользователь не найден"));
                return ResponseEntity.ok(AuthResponse.UserResponse.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .userTag(user.getUserTag())
                        .email(user.getEmail())
                        .build());
            } catch (Exception e) {
                log.warn("Ошибка получения данных пользователя");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }

        log.warn("Отсутствует токен авторизации");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/profile")
    public ResponseEntity<AuthResponse.UserResponse> updateProfile(
            HttpServletRequest request,
            @RequestBody com.chatapplication.core.dtos.UpdateProfileRequest updateRequest) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String subject = jwtUtil.extractSubject(token);
                UUID userId = UUID.fromString(subject);
                AuthResponse.UserResponse response = authService.updateProfile(userId, updateRequest);
                return ResponseEntity.ok(response);
            } catch (IllegalArgumentException e) {
                log.warn("Ошибка при обновлении профиля: {}", e.getMessage());
                return ResponseEntity.badRequest().build();
            } catch (Exception e) {
                log.warn("Не удалось обновить профиль: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @GetMapping("/search")
    public ResponseEntity<java.util.List<AuthResponse.UserResponse>> searchUsers(
            @RequestParam(value = "query", required = false, defaultValue = "") String query) {
        String cleanQuery = query.trim().startsWith("@") ? query.trim().substring(1) : query.trim();
        java.util.List<AppUser> users;
        if (cleanQuery.isBlank()) {
            users = userRepository.findAll();
        } else {
            String lower = cleanQuery.toLowerCase();
            users = userRepository.findAll().stream()
                    .filter(u -> (u.getUserTag() != null && u.getUserTag().toLowerCase().contains(lower)) ||
                                 (u.getUsername() != null && u.getUsername().toLowerCase().contains(lower)))
                    .toList();
        }

        java.util.List<AuthResponse.UserResponse> responses = users.stream()
                .map(u -> AuthResponse.UserResponse.builder()
                        .id(u.getId())
                        .username(u.getUsername())
                        .userTag(u.getUserTag())
                        .email(u.getEmail())
                        .build())
                .toList();

        return ResponseEntity.ok(responses);
    }
}
