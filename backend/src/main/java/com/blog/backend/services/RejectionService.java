package com.blog.backend.services;

import com.blog.backend.models.Rejection;
import com.blog.backend.repositories.ClaimRepository;
import com.blog.backend.repositories.RejectionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RejectionService {

    @Autowired
    private RejectionRepository rejectionRepository;
    @Autowired
    private ClaimRepository claimRepository;

    public List<Rejection> findAll() {
        return rejectionRepository.findAll();
    }

    public Optional<Rejection> findRejectionByIdClaim(Long id) {
        return rejectionRepository.findByClaim(claimRepository.findByIdClaim(id));
    }

    public Rejection saveRejection(Rejection rejection, Long id) {
        rejection.setClaim(claimRepository.findByIdClaim(id));
        return rejectionRepository.save(rejection);
    }

    public void deleteRejection(Long id) {
        rejectionRepository.deleteById(id);
    }

}
