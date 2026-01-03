package com.ssp.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssp.model.Issue;
import com.ssp.model.Project;
import com.ssp.model.User;
import com.ssp.repository.IssueRepository;
import com.ssp.request.IssueRequest;

@Service
public class IssueServiceImpl implements IssueService {
    
    @Autowired
    private IssueRepository issueRepository;

    @Autowired
    private ProjectService projectService;
    
    @Autowired
    private UserService userService;

    @Override
    public Issue getIssueById(Long issueId) throws Exception {
        
        Optional<Issue> issue = issueRepository.findById(issueId);
        if(issue.isPresent()){
            return issue.get();
        }

        throw new Exception("No issues found with the given ID" + issueId);
    }

    @Override
    public List<Issue> getIssuedByProjectId(Long projectId) throws Exception {
        
        return issueRepository.findByProjectID(projectId);
    }

    @Override
    public Issue createIssue(IssueRequest issueRequest, User user) throws Exception {
        
        Project project = projectService.getProjectById(issueRequest.getProjectId());

        Issue issue = new Issue();
        issue.setTitle(issueRequest.getTitle());
        issue.setDescription(issueRequest.getDescription());
        issue.setStatus(issueRequest.getStatus());
        //issue.setProjectID(issueRequest.getProjectId());
        issue.setProjectID(issue.getProjectID());
        issue.setPriority(issueRequest.getPriority());
        issue.setDueDate(issueRequest.getDueDate());

        issue.setProject(project);

        return issueRepository.save(issue);
    }

    @Override
    public void deleteIssue(Long issueId, Long userid) throws Exception {
        
        getIssueById(issueId);

        issueRepository.deleteById(issueId);
    }

    @Override
    public Issue addUserToIssue(Long issueId, Long userId) throws Exception {
        
        User user = userService.findUserById(userId);
        Issue issue = getIssueById(issueId);
        issue.setAssignee(user);
        return issueRepository.save(issue);

    }

    @Override
    public Issue updateStatus(Long issueId, String status) throws Exception {
        
        Issue issue = getIssueById(issueId);
        issue.setStatus(status);
        return issueRepository.save(issue);
    }

}
