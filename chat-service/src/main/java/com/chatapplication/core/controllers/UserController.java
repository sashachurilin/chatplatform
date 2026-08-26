package com.chatapplication.core.controllers;

import com.chatapplication.core.dtos.SearchRequest;
import com.chatapplication.core.dtos.UpdateProfileRequest;
import com.chatapplication.core.dtos.UserResponse;
import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.security.JwtUtil;
import com.chatapplication.core.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getProfile(HttpServletRequest request) {
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String subject = jwtUtil.extractSubject(token);
                UUID userId = UUID.fromString(subject);
                AppUser user = userService.getById(userId);
                return ResponseEntity.ok(convertToUserResponse(user));
            } catch (Exception e) {
                log.warn("Ошибка получения профиля пользователя");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }
        }

        log.warn("Отсутствует токен авторизации");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(
            HttpServletRequest request,
            @Valid @RequestBody UpdateProfileRequest profileUpdate) {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            try {
                String subject = jwtUtil.extractSubject(token);
                UUID userId = UUID.fromString(subject);
                AppUser updatedUser = userService.updateProfile(
                        userId,
                        profileUpdate.getUsername(),
                        profileUpdate.getUserTag(),
                        profileUpdate.getBio(),
                        profileUpdate.getAvatarUrl()
                );
                return ResponseEntity.ok(convertToUserResponse(updatedUser));
            } catch (IllegalArgumentException e) {
                log.warn("Ошибка обновления профиля: {}", e.getMessage());
                return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
            } catch (Exception e) {
                log.warn("Ошибка обновления профиля пользователя");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        log.warn("Отсутствует токен авторизации");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    @PostMapping("/search")
    public ResponseEntity<List<UserResponse>> searchByUserTag(
            @Valid @RequestBody SearchRequest searchRequest) {

        List<AppUser> users = userService.searchByUserTag(searchRequest.getUserTag());
        List<UserResponse> response = users.stream()
                .map(this::convertToUserResponse)
                .toList();
        return ResponseEntity.ok(response);
    }

    private UserResponse convertToUserResponse(AppUser user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .userTag(user.getUserTag())
                .email(user.getEmail())
                .avatarUrl(user.getAvatarUrl())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .lastLogin(user.getLastLogin())
                .totalOnlineTime(user.getTotalOnlineTime())
                .build();
    }
}
