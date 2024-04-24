package com.api.restapi.controllers;

import com.api.restapi.models.Rejection;
import com.api.restapi.services.RejectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/rejections")
public class RejectionController {

    private final RejectionService rejectionService;

    public RejectionController(RejectionService rejectionService) {
        this.rejectionService = rejectionService;
    }

    @PostMapping
    public ResponseEntity<Rejection> createRejection(@RequestBody Rejection rejection) {
        try {
            Rejection savedRejection = rejectionService.createRejection(rejection);
            return ResponseEntity.ok(savedRejection);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Rejection> getRejectionById(@PathVariable long id) {
        try {
            Rejection rejection = rejectionService.getRejectionById(id);
            return ResponseEntity.ok(rejection);
        } catch (RuntimeException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<Rejection>> getAllRejections() {
        List<Rejection> rejections = rejectionService.getAllRejections();
        return ResponseEntity.ok(rejections);
    }
}
