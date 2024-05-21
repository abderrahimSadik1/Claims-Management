package com.blog.backend.repositories;

import com.blog.backend.models.Claim;
import com.blog.backend.models.Rejection;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RejectionRepository extends JpaRepository<Rejection, Long> {
    Optional<Rejection> findByClaim(Claim claim);
}