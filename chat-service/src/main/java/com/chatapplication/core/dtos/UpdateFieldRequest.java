package com.chatapplication.core.dtos;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateFieldRequest {

    @Size(min = 1, message = "Значение не может быть пустым")
    private String value;
}