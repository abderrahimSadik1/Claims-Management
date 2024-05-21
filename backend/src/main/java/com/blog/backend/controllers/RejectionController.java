package com.blog.backend.controllers;

import com.blog.backend.models.Rejection;
import com.blog.backend.models.User;
import com.blog.backend.services.RejectionService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/rejections")
public class RejectionController {

    @Autowired
    private RejectionService rejectionService;

    @GetMapping
    public ResponseEntity<List<Rejection>> getAllRejections() {

        List<Rejection> rejections = rejectionService.findAll();
        return ResponseEntity.ok(rejections);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rejection> getRejectionById(@PathVariable Long id) {
        Optional<Rejection> rejection = rejectionService.findRejectionByIdClaim(id);
        return rejection.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> createRejection(@PathVariable Long id, @RequestBody Rejection rejection,
            Authentication authentication) {
        rejection.setManager((User) authentication.getPrincipal());
        rejection.setRejectedAt(LocalDateTime.now());
        rejectionService.saveRejection(rejection, id);
        return ResponseEntity.ok("Rejection created successfully");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRejection(@PathVariable Long id) {
        rejectionService.deleteRejection(id);
        return ResponseEntity.noContent().build();
    }

}
