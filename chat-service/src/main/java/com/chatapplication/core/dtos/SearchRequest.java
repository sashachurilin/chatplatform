package com.chatapplication.core.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequest {

    @NotBlank(message = "UserTag обязателен для поиска")
    @Size(min = 1, max = 50, message = "UserTag должен содержать от 1 до 50 символов")
    private String userTag;
}
