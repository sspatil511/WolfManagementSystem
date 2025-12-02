package com.ssp.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssp.model.Chat;
import com.ssp.model.Project;
import com.ssp.model.User;
import com.ssp.repository.ProjectRepository;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatService chatService;

    @Override
    public Project createProject(Project project, User user) throws Exception {
        
        Project createdProject = new Project();
        createdProject.setOwner(user);
        createdProject.setTags(project.getTags());
        createdProject.setName(project.getName());
        createdProject.setDescription(project.getDescription());
        createdProject.setCategory(project.getCategory());
        createdProject.getTeam().add(user);

        Project savedProject = projectRepository.save(createdProject);
        
        Chat chat = new Chat();
        chat.setProject(savedProject); 
        
        Chat projectChat = chatService.createChat(chat);

        return savedProject;
        
    }

    @Override
    public List<Project> getProjectByTeam(User user, String category, String tag) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getProjectByTeam'");
    }

    @Override
    public Project getProjectById(Long projectId) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getProjectById'");
    }

    @Override
    public void deleteProject(Long projectId, Long userId) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'deleteProject'");
    }

    @Override
    public Project updateProject(Project updatedProject, Long id) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'updateProject'");
    }

    @Override
    public void addUserToProject(Long projectId, Long userId) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'addUserToProject'");
    }

    @Override
    public void removeUserFromProject(Long projectId, Long userId) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'removeUserFromProject'");
    }

    @Override
    public Chat getChatByProjectId(Long projectId) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getChatByProjectId'");
    }

}
