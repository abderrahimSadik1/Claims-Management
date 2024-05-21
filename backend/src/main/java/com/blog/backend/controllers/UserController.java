package com.blog.backend.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.models.User;
import com.blog.backend.services.UserService;
import com.blog.backend.dto.UserDTO;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userSerivce;

    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getAuteurByUsername(@PathVariable String username) {
        UserDTO userDTO = userSerivce.getAuteurByUsername(username);
        return ResponseEntity.ok(userDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable Long id, Authentication authentication) {
        userSerivce.deleteAuteur(id);
        return ResponseEntity.ok("Article deleted successfully.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateAuteur(@PathVariable Long id, @RequestBody User updatedAuteur) {
        User user = userSerivce.updateAuteur(id, updatedAuteur);
        return ResponseEntity.ok(user);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAuteur() {
        List<User> user = userSerivce.getAll();
        return ResponseEntity.ok(user);
    }

}