package com.ssp.service;

import java.util.List;
import java.util.Optional;

import com.ssp.model.Issue;
import com.ssp.model.Project;
import com.ssp.model.User;
import com.ssp.request.IssueRequest;

public interface IssueService {

    Issue getIssueById(Long issueId) throws Exception;

    List<Issue> getIssuedByProjectId(Long projectId) throws Exception;

    Issue createIssue(IssueRequest issue, User user) throws Exception;

    void deleteIssue(Long issueId, Long userid) throws Exception;

    Issue addUserToIssue(Long issueId, Long userId) throws Exception;

    Issue updateStatus(Long issueId, String status) throws Exception;


}
