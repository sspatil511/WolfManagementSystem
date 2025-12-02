package com.ssp.service;

import org.springframework.stereotype.Service;

import com.ssp.model.Chat;
import com.ssp.repository.ChatRepository;

@Service
public class ChatServiceImpl implements ChatService {

    private ChatRepository chatRepository;


    @Override
    public Chat createChat(Chat chat) {
        
        return chatRepository.save(chat);
    }

}
