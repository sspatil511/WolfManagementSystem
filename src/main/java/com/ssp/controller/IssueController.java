package com.ssp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssp.DTO.IssueDTO;
import com.ssp.model.Issue;
import com.ssp.model.User;
import com.ssp.request.IssueRequest;
import com.ssp.response.MessageResponse;
import com.ssp.service.IssueService;
import com.ssp.service.UserService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

@RestController
@Validated
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @GetMapping("/{issueId}")
    public ResponseEntity<Issue> getIssueById(@Positive(message = "Issue ID must be positive") 
                                                @PathVariable Long issueId) throws Exception {

        return ResponseEntity.ok(issueService.getIssueById(issueId));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Issue>> getIssueByProjectId(@Positive(message = "Project ID must be positive") 
                                                           @PathVariable Long projectId) throws Exception {

        return ResponseEntity.ok(issueService.getIssuedByProjectId(projectId));
    }

    @PostMapping
    public ResponseEntity<IssueDTO> createIssue(@Valid @RequestBody IssueRequest issue, 
                                                @RequestHeader("Authorization") String token) throws Exception {

        //System.out.println("issue-----" + issue);
        
        User tokenUser = userService.findUserProfileByJwt(token);
        
        Issue createdIssue = issueService.createIssue(issue, tokenUser);
        IssueDTO issueDTO = new IssueDTO();
        issueDTO.setDescription(createdIssue.getDescription());
        issueDTO.setDueDate(createdIssue.getDueDate());
        issueDTO.setId(createdIssue.getId());
        issueDTO.setPriority(createdIssue.getPriority());
        issueDTO.setProject(createdIssue.getProject());
        issueDTO.setProjectID(createdIssue.getProjectID());
        issueDTO.setStatus(createdIssue.getStatus());
        issueDTO.setTitle(createdIssue.getTitle());
        issueDTO.setTags(createdIssue.getTags());
        issueDTO.setAssignee(createdIssue.getAssignee());

        return ResponseEntity.ok(issueDTO);
        
    }

    @DeleteMapping("/{issueId}")
    public ResponseEntity<MessageResponse> deleteIssue(@Positive(message = "Invalid issue ID") @PathVariable Long issueId,
                                                    @RequestHeader("Authorization") String token) throws Exception {

        
        User user = userService.findUserProfileByJwt(token);
        issueService.deleteIssue(issueId, user.getId());

        MessageResponse res = new MessageResponse();
        res.setMessage("Issue deleted");
        
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{issueId}/assignee/{userId}")
    public ResponseEntity<Issue> addUserToIssue(@Positive(message = "Invalid issue ID") @PathVariable Long issueId, 
                                              @Positive(message = "Invalid user ID") @PathVariable Long userId,
                                              @RequestHeader("Authorization") String token) throws Exception {

        // Token validation is handled by JwtTokenValidator filter
        Issue issue = issueService.addUserToIssue(issueId, userId);
        return ResponseEntity.ok(issue);
    }

    @PutMapping("/{issueId}/status/{status}")
    public ResponseEntity<Issue> updateIssueStatus(@NotBlank(message = "Status is required") @PathVariable String status, 
                                                    @Positive(message = "Invalid issue ID") @PathVariable Long issueId,
                                                    @RequestHeader("Authorization") String token) throws Exception {

        // Token validation is handled by JwtTokenValidator filter
        Issue issue = issueService.updateStatus(issueId, status);
        return ResponseEntity.ok(issue);

    }
    
}
