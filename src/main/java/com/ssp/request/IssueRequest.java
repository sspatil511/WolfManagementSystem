package com.ssp.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class IssueRequest {

    private String title;
    private String description;
    private String status; // e.g., Open, In Progress, Closed
    private Long projectId;
    private String priority; // e.g., Low, Medium, High
    private LocalDate dueDate;
}
