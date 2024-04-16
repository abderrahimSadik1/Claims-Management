package com.api.restapi.models;

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
@Table(name = "claims")
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idClaim;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    private User user;

    @Enumerated(EnumType.STRING)
    private Status status;

}