package com.api.restapi.repositories;

import com.api.restapi.models.Claim;
import com.api.restapi.models.Rejection;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RejectionRepository extends JpaRepository<Rejection, Long> {
    Optional<Claim> findByTitle(String title); // Example based on title and user ID
}