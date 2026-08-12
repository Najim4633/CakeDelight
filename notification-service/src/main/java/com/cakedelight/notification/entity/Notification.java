package com.cakedelight.notification.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false)
    private String recipientEmail;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String status; // e.g., SENT, FAILED

    private LocalDateTime sentAt;
}