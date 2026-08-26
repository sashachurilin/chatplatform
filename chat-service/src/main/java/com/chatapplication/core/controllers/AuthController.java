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
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Запрос на регистрацию: {}", request.getUsername());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
                        .avatarUrl(user.getAvatarUrl())
                        .bio(user.getBio())
                        .build());
            } catch (Exception e) {
                log.warn("Ошибка получения данных пользователя");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }

        log.warn("Отсутствует токен авторизации");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }
}
