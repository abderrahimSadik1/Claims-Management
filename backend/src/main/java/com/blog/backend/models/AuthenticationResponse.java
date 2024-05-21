package com.blog.backend.models;

public class AuthenticationResponse {
    private String token;
    private String message;
    private Role role;

    public AuthenticationResponse(String token, String message, Role role) {
        this.token = token;
        this.role = role;
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public String getMessage() {
        return message;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
