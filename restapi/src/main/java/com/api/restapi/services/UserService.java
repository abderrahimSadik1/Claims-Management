package com.api.restapi.services;

import java.util.List;

import com.api.restapi.models.User;

public interface UserService {
    User registerUser(User user);

    List<User> getAllUsers();

    User loginUser(String email, String password);
}
