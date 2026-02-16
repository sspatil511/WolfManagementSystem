package com.ssp.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ssp.model.Chat;
import com.ssp.model.Invitation;
import com.ssp.model.Project;
import com.ssp.model.User;
import com.ssp.repository.InviteRequest;
import com.ssp.response.MessageResponse;
import com.ssp.service.InvitationService;
import com.ssp.service.ProjectService;
import com.ssp.service.UserService;

import jakarta.validation.Valid;


@RestController
@RequestMapping("/api/projects")
@Validated

public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private UserService userService;

    @Autowired
    private InvitationService invitationService;

    @GetMapping
    public ResponseEntity<List<Project>> getProjects(
        @RequestParam(required = false) String category,
        @RequestParam(required = false) String tag,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        User user = userService.findUserProfileByJwt(jwt);
        
        List<Project> projects = projectService.getProjectByTeam(user, category, tag);

        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProjectById(
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        //User user = userService.findUserProfileByJwt(jwt);
        
        Project project = projectService.getProjectById(projectId);

        return new ResponseEntity<>(project, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Project> createProject(
        @RequestHeader("Authorization") String jwt,
        @RequestBody Project project
    ) throws Exception{
        
        User user = userService.findUserProfileByJwt(jwt);
        
        Project createdProject = projectService.createProject(project, user);

        return new ResponseEntity<>(createdProject, HttpStatus.OK);
    }


    @PatchMapping("/{projectId}")
    public ResponseEntity<Project> updateProject(
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String jwt,
        @RequestBody Project project
    ) throws Exception{
         
        Project updatedProject = projectService.updateProject(project, projectId);

        return new ResponseEntity<>(updatedProject, HttpStatus.OK);
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<MessageResponse> deleteProject(
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        User user = userService.findUserProfileByJwt(jwt);
        projectService.deleteProject(projectId, user.getId());
        MessageResponse res = new MessageResponse("Project deleted successfully");
        
        return new ResponseEntity<>(res, HttpStatus.OK);
    }


    @GetMapping("/search")
    public ResponseEntity<List<Project>> searchProjects(
        @RequestParam(required = false) String keyword,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        User user = userService.findUserProfileByJwt(jwt);
        
        List<Project> projects = projectService.searchProjects(keyword, user);

        return new ResponseEntity<>(projects, HttpStatus.OK);
    }

    @GetMapping("/{projectId}/chat")
    public ResponseEntity<Chat> getChatByProjectId(
        @PathVariable Long projectId,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        //User user = userService.findUserProfileByJwt(jwt);
        
        Chat chat = projectService.getChatByProjectId(projectId);

        return new ResponseEntity<>(chat, HttpStatus.OK);
    }

    @PostMapping("/invite")
    public ResponseEntity<MessageResponse> inviteProject(
        @Valid @RequestBody InviteRequest req,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        User user = userService.findUserProfileByJwt(jwt);
        Project project = projectService.getProjectById(req.getProjectId());
        
        // Check if user is project owner
        if (!project.getOwner().getId().equals(user.getId())) {
            throw new Exception("Only project owner can send invitations");
        }
        
        invitationService.sendInvitation(req.getEmail().trim().toLowerCase(), req.getProjectId());
        MessageResponse res = new MessageResponse("User invited successfully");
        
        return new ResponseEntity<>(res, HttpStatus.OK);
            
    }
    
    @GetMapping("/accept_invitation")
    public ResponseEntity<Invitation> acceptInviteProject(
        @RequestParam String token,
        @RequestHeader("Authorization") String jwt
    ) throws Exception{
        
        User user = userService.findUserProfileByJwt(jwt);
        Invitation invitation = invitationService.acceptInvitation(token, user.getId());
        projectService.addUserToProject(invitation.getProjectId(), user.getId());

         
        return new ResponseEntity<>(invitation, HttpStatus.ACCEPTED);
    }
}
