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
@Table(name = "rejections")
public class Rejection {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idRejection;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne
    private Claim claim;

}