package com.api.restapi.services.impl;

import com.api.restapi.models.Claim;
import com.api.restapi.repositories.ClaimRepository;
import com.api.restapi.services.ClaimService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;

    @Autowired
    public ClaimServiceImpl(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    @Override
    public Claim saveClaim(Claim claim) {
        return claimRepository.save(claim);
    }

    @Override
    public Optional<Claim> getClaimById(Long id) {
        return claimRepository.findById(id);
    }

    @Override
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    @Override
    public void deleteClaim(Long id) {
        claimRepository.deleteById(id);
    }
}
