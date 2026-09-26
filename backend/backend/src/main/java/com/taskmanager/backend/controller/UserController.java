package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.LoginResponse;
import com.taskmanager.backend.dto.UserResponse;
import com.taskmanager.backend.entity.User;
import com.taskmanager.backend.security.JwtService;
import com.taskmanager.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public UserResponse registerUser(@RequestBody User user) {

        User savedUser = userService.registerUser(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail()
        );
    }

    @PostMapping("/login")
    public LoginResponse loginUser(@RequestBody User user) {

        User loggedInUser = userService.loginUser(
                user.getEmail(),
                user.getPassword()
        );

        if (loggedInUser == null) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(
                loggedInUser.getEmail()
        );

        return new LoginResponse(
                loggedInUser.getId(),
                loggedInUser.getName(),
                loggedInUser.getEmail(),
                token
        );
    }
}