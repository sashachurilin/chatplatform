package com.chatapplication.core.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 3, max = 50, message = "Имя пользователя должно содержать от 3 до 50 символов")
    private String username;

    @Size(min = 3, max = 20, message = "UserTag должен содержать от 3 до 20 символов")
    private String userTag;

    @Size(max = 500, message = "Биография не должна превышать 500 символов")
    private String bio;

    @Size(max = 500, message = "URL аватара не должен превышать 500 символов")
    private String avatarUrl;

    @Email(message = "Email должен быть валидным")
    private String email;
}