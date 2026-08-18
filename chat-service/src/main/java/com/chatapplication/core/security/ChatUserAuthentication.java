package com.chatapplication.core.security;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.UUID;

public class ChatUserAuthentication extends UsernamePasswordAuthenticationToken {

    private final UUID userId;

    public ChatUserAuthentication(UUID userId, Object principal, Object credentials,
                                  Collection<? extends GrantedAuthority> authorities) {
        super(principal, credentials, authorities);
        this.userId = userId;
    }

    public UUID getUserId() {
        return userId;
    }

    @SuppressWarnings("unchecked")
    public static ChatUserAuthentication from(UsernamePasswordAuthenticationToken original, UUID userId) {
        return new ChatUserAuthentication(
                userId,
                original.getPrincipal(),
                original.getCredentials(),
                original.getAuthorities()
        );
    }
}
