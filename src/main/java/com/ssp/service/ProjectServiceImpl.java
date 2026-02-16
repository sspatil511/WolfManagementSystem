package com.ssp.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssp.model.Chat;
import com.ssp.model.Project;
import com.ssp.model.User;
import com.ssp.repository.ProjectRepository;
import com.ssp.repository.UserRepository;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public Project createProject(Project project, User user) throws Exception {
        
        Project createdProject = new Project();
        createdProject.setOwner(user);
        createdProject.setTags(project.getTags());
        createdProject.setName(project.getName());
        createdProject.setDescription(project.getDescription());
        createdProject.setCategory(project.getCategory());
        createdProject.getTeam().add(user);
        createdProject.setProjectSize(1); // Owner is the first member

        Project savedProject = projectRepository.save(createdProject);
        
        // Increment owner's project count
        userService.updateUsersNumProjects(user, 1);
        
        Chat chat = new Chat();
        chat.setProject(savedProject); 
        
        Chat projectChat = chatService.createChat(chat);
        
        savedProject.setChat(projectChat);

        return savedProject;
        
    }

    @Override
    public List<Project> getProjectByTeam(User user, String category, String tag) throws Exception {
        
        List<Project> projects = projectRepository.findByTeamContainingOrOwner(user, user);

        if(category != null){

            projects = projects.stream()
                        .filter(project -> project.getCategory().equals(category))
                        .collect(Collectors.toList());
        }

        if(tag != null){

            projects = projects.stream()
                        .filter(project -> project.getTags().contains(tag))
                        .collect(Collectors.toList());
        }


        return projects;
    }

    @Override
    public Project getProjectById(Long projectId) throws Exception {
        
        Optional<Project> optionalProject = projectRepository.findById(projectId);

        if(optionalProject.isEmpty()){
            throw new Exception("Project not found");
        } 
        
        return optionalProject.get();
        
    }

    @Override
    public void deleteProject(Long projectId, Long userId) throws Exception {
       
        Project project = projectRepository.findById(projectId)
                            .orElseThrow(() -> new Exception("Project not found with id: " + projectId));

        if(!project.getOwner().getId().equals(userId)){
            throw new Exception("Access denied. Only the project owner can delete the project.");
        }
        
        User owner = project.getOwner();
        owner.setNumProjects(owner.getNumProjects() - 1); // Decrement owner's project count
        userRepository.save(owner);
        
        projectRepository.deleteById(projectId);

    }

    @Override
    public Project updateProject(Project updatedProject, Long id) throws Exception {
        
        Project project = getProjectById(id);

        project.setName(updatedProject.getName());
        project.setDescription(updatedProject.getDescription());
        project.setCategory(updatedProject.getCategory());
        project.setTags(updatedProject.getTags());

        return projectRepository.save(project);
    }

    @Override
    public void addUserToProject(Long projectId, Long userId) throws Exception {
        
        Project project = getProjectById(projectId);
        User user = userService.findUserById(userId);

        if(!project.getTeam().contains(user)){

            project.getChat().getUsers().add(user);
            project.getTeam().add(user);
            project.setProjectSize(project.getProjectSize() + 1); // Increment project size
            
            // Increment user's project count
            userService.updateUsersNumProjects(user, 1);
        }

        projectRepository.save(project);

    }

    @Override
    public void removeUserFromProject(Long projectId, Long userId) throws Exception {
        
        Project project = getProjectById(projectId);
        User user = userService.findUserById(userId);

        if(project.getTeam().contains(user)){

            project.getChat().getUsers().remove(user);
            project.getTeam().remove(user);
            project.setProjectSize(project.getProjectSize() - 1); // Decrement project size
            
            // Decrement user's project count
            userService.updateUsersNumProjects(user, -1);
        }

        projectRepository.save(project);
    }

    @Override
    public Chat getChatByProjectId(Long projectId) throws Exception {
        
        Project project = getProjectById(projectId);
        
        return project.getChat();

    }

    @Override
    public List<Project> searchProjects(String keyword, User user) throws Exception {
        
        return projectRepository.findByNameContainingAndTeamContains(keyword, user);

    }

}
