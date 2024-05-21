package com.blog.backend.dto;

public class UserDTO {
    private Long id;
    private String username;

    public UserDTO(Long id, String username) {
        this.id = id;
        this.username = username;

    }

    public Long getIdUtilisateur() {
        return id;
    }

    public void setIdUtilisateur(Long idUtilisateur) {
        this.id = idUtilisateur;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
