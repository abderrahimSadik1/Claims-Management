package com.api.restapi.services;

import com.api.restapi.models.Claim;
import com.api.restapi.models.Status;

import java.util.List;
import java.util.Optional;

public interface ClaimService {
    Claim saveClaim(Claim claim);

    Optional<Claim> getClaimById(Long id);

    List<Claim> getAllClaims();

    void deleteClaim(Long id);
}
