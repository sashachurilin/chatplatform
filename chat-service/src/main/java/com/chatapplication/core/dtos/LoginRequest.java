package com.chatapplication.core.dtos;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @NotBlank(message = "Имя пользователя или email обязательны")
    private String usernameOrEmail;

    @NotBlank(message = "Пароль обязателен")
    private String password;
}
