package com.chatapplication.core.security;

import com.chatapplication.core.entities.AppUser;
import com.chatapplication.core.entities.enums.UserStatus;
import com.chatapplication.core.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        AppUser user = userRepository
                .findByUsername(usernameOrEmail)
                .or(() -> userRepository.findByEmail(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден: " + usernameOrEmail));

        return new User(
                user.getUsername(),
                user.getPassword(),
                user.getStatus() == UserStatus.OFFLINE ? false : true,
                true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }

    public UserDetails loadUserById(java.util.UUID userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден: " + userId));

        return new User(
                user.getUsername(),
                user.getPassword(),
                true, true, true, true,
                List.of(new SimpleGrantedAuthority("ROLE_USER"))
        );
    }
}
