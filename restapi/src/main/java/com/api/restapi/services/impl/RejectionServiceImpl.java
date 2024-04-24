package com.api.restapi.services.impl;

import com.api.restapi.models.Rejection;
import com.api.restapi.repositories.RejectionRepository;
import com.api.restapi.services.RejectionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RejectionServiceImpl implements RejectionService {

    private final RejectionRepository rejectionRepository;

    @Autowired
    public RejectionServiceImpl(RejectionRepository rejectionRepository) {
        this.rejectionRepository = rejectionRepository;
    }

    @Override
    public Rejection createRejection(Rejection rejection) {
        return rejectionRepository.save(rejection);
    }

    @Override
    public Rejection getRejectionById(long id) {
        // Use findById() which returns an Optional, thus we need to handle the case
        // when the Rejection is not found
        return rejectionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rejection not found with id " + id));
    }

    @Override
    public List<Rejection> getAllRejections() {
        return rejectionRepository.findAll();
    }
}