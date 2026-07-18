package com.chatapplication.core.entities;

import com.chatapplication.core.entities.enums.UserStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@Entity
public class User {

    /**
     *  Уникальный идентификатор пользователя
     */
    @Id
    private UUID id;

    /**
     * Имя пользователя
     */
    private String username;

    /**
     *  Настоящее имя пользователя
     */
    private String firstName;

    /**
     *  Настоящяя фамилия пользователя
     */
    private String lastName;

    /**
     *  Настоящее отчество пользователя
     */
    private String middleName;

    /**
     * Почта пользователя
     */
    private String email;

    /**
     * Пароль пользователя
     */
    private String password;

    /**
     * Статус текущей активности пользователя
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserStatus status;

    /**
     *
     */
    private Instant lastActivity;

    private Instant lastLogin;

    private Instant lastLogout;

    private Long totalOnlineTime;

}
