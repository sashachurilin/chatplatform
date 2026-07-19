package com.chatapplication.core.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;

import java.util.UUID;

@Data
@Entity
public class UserActivity {

    @Id
    private UUID id;


}
