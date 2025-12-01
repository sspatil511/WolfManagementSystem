package com.ssp.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ssp.model.Chat;
import com.ssp.model.Project;
import com.ssp.model.User;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Override
    public Project createProject(Project project, User user) throws Exception {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'createProject'");
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
