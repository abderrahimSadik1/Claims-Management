package com.api.restapi.services;

import com.api.restapi.models.Rejection;

import java.util.List;

public interface RejectionService {
    Rejection createRejection(Rejection rejection);

    Rejection getRejectionById(long id);

    List<Rejection> getAllRejections();
}
