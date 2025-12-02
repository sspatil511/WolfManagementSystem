package com.ssp.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ssp.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {

}
