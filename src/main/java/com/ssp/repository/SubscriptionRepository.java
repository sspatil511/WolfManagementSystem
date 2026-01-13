package com.ssp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssp.model.Subscription;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Subscription findByUserId(Long userId);
}
