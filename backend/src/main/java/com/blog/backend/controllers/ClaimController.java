package com.blog.backend.controllers;

import org.springframework.web.bind.annotation.RestController;

import com.blog.backend.models.Claim;
import com.blog.backend.models.Status;
import com.blog.backend.models.User;
import com.blog.backend.services.ClaimService;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/claims")
public class ClaimController {

    @Autowired
    ClaimService claimService;

    @PostMapping("/add")
    public ResponseEntity<?> addClaim(@RequestBody Claim claim, Authentication authentication) {
        claim.setUser((User) authentication.getPrincipal());
        claim.setStatus(Status.SENT);
        claim.setCreatedAt(LocalDateTime.now());
        claimService.addClaim(claim);
        return ResponseEntity.ok("Claim created successfully");
    }

    @GetMapping("/manager/all") // for managers
    public ResponseEntity<List<Claim>> getAllClaims() {
        List<Claim> claims = claimService.findAll();
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/all") // for users
    public ResponseEntity<List<Claim>> getAllClaimsByUser(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Claim> claims = claimService.findByUser(user);
        return ResponseEntity.ok(claims);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getClaim(@PathVariable Long id) {
        Claim claims = claimService.findById(id);
        return ResponseEntity.ok(claims);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateClaim(@PathVariable Long id, @RequestBody Claim claim,
            Authentication authentication) {
        boolean isManager = authentication.getAuthorities().stream()
                .anyMatch(authority -> "MANAGER".equals(authority.getAuthority()));
        String username = authentication.getName();
        claimService.updateClaim(id, claim, username, isManager);
        return ResponseEntity.ok("claim updated successfully");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteClaim(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        claimService.deleteClaim(id, username);
        return ResponseEntity.ok("Deleted successfully");
    }

}
