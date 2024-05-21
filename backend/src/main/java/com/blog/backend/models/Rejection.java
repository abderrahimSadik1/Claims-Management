package com.blog.backend.models;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "rejections")
public class Rejection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idRejection;

    private String title;

    private LocalDateTime rejectedAt;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    private Claim claim;

    @ManyToOne
    private User manager;

}