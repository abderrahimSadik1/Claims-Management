package com.blog.backend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.backend.models.User;
import com.blog.backend.repositories.UserRepository;
import com.blog.backend.dto.UserDTO;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public UserDTO getAuteurById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserDTO(user.getId(), user.getUsername());
        } else {
            return null;
        }
    }

    public UserDTO getAuteurByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return new UserDTO(user.getId(), user.getUsername());
        } else {
            return null;
        }
    }

    public User updateAuteur(Long id, User updatedAuteur) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Auteur not found with id: " + id));
        existingUser.setRole(updatedAuteur.getRole());

        return userRepository.save(existingUser);
    }

    public void deleteAuteur(Long id) {
        userRepository.deleteById(id);
    }

    public List<User> getAll() {
        List<User> users = userRepository.findAll();
        return users;
    }
}
