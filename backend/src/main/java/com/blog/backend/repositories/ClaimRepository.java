package com.blog.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.blog.backend.models.Claim;
import com.blog.backend.models.User;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    Claim findByIdClaim(long idClaim);

    List<Claim> findByUser(User user);
}
