package com.ssp.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssp.model.Chat;
import com.ssp.model.Message;
import com.ssp.model.User;
import com.ssp.repository.MessageRepository;
import com.ssp.repository.UserRepository;

@Service
public class MessageServiceImpl implements MessageService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ProjectService projectService;

    @Override
    public Message sendMessage(Long senderId, Long projectId, String content) throws Exception {
        
        User sender = userRepository.findById(senderId).orElseThrow(() -> new Exception("User not found with id: " + senderId));

        Chat chat = projectService.getProjectById(projectId).getChat();

        Message message = new Message();
        message.setContent(content);
        message.setSender(sender);
        message.setCreatedAt(LocalDateTime.now());
        message.setChat(chat);
        Message savedMessage = messageRepository.save(message);

        chat.getMessages().add(savedMessage);

        return savedMessage;
    }

    @Override
    public List<Message> getMessagesByProjectId(Long projectId) throws Exception {
        
        Chat chat = projectService.getChatByProjectId(projectId);
        List<Message> findByChatIdOrderByCreatedAtAsc = messageRepository.findByChatIdOrderByCreatedAtAsc(chat.getId());

        return findByChatIdOrderByCreatedAtAsc;
    }

}
