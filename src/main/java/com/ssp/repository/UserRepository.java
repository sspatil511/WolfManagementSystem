package com.ssp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssp.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
    User findByEmail(String email);
} 
