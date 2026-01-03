package com.ssp.DTO;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.ssp.model.Project;
import com.ssp.model.User;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class IssueDTO {

    private Long id;
    private String title;
    private String description;
    private String status; // e.g., Open, In Progress, Closed
    private Long projectID;
    private String priority; // e.g., Low, Medium, High
    private LocalDate dueDate;
    private List<String> tags = new ArrayList<>();  
    private Project project;
    private User assignee;
}
