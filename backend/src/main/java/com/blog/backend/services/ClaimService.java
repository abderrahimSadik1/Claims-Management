package com.blog.backend.services;

import java.util.List;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.blog.backend.models.Claim;
import com.blog.backend.models.Rejection;
import com.blog.backend.models.User;
import com.blog.backend.repositories.ClaimRepository;
import com.blog.backend.repositories.RejectionRepository;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepository;
    @Autowired
    private RejectionRepository rejectionRepository;

    public List<Claim> findAll() {
        return claimRepository.findAll();
    }

    public Claim findById(Long id) {
        return claimRepository.findByIdClaim(id);
    }

    public List<Claim> findByUser(User user) {
        return claimRepository.findByUser(user);
    }

    public Claim addClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    public void deleteClaim(long id, String username) {
        Optional<Claim> optionalClaim = claimRepository.findById(id);
        if (optionalClaim.isPresent()) {
            Claim claim = optionalClaim.get();
            if (claim.getUser().getUsername().equals(username)) {
                Optional<Rejection> optionalRejection = rejectionRepository.findByClaim(claim);
                optionalRejection.ifPresent(rejection -> rejectionRepository.deleteById(rejection.getIdRejection()));
                claimRepository.deleteById(id);
            } else {
                throw new IllegalArgumentException("Username does not match the claim owner");
            }
        } else {
            throw new IllegalArgumentException("Claim not found");
        }
    }

    public Claim updateClaim(long id, Claim updatedClaim, String username, boolean isManager) {
        Optional<Claim> optionalClaim = claimRepository.findById(id);

        if (optionalClaim.isPresent()) {
            Claim existingClaim = optionalClaim.get();
            if (existingClaim.getUser().getUsername().equals(username) || isManager) {
                // Update the fields of the existing claim with values from the updated claim
                existingClaim.setTitle(updatedClaim.getTitle());
                existingClaim.setDescription(updatedClaim.getDescription());
                if (isManager) {
                    existingClaim.setStatus(updatedClaim.getStatus());
                }
                // Add any other fields you need to update
                return claimRepository.save(existingClaim);
            } else {
                throw new IllegalArgumentException("Username does not match the claim owner");
            }
        } else {
            throw new IllegalArgumentException("Claim not found");
        }
    }
}
