package com.ssp.request;

import java.time.LocalDate;

import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class IssueRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Status is required")
    private String status; // e.g., Open, In Progress, Closed

    @NotNull(message = "Project ID is required")
    @Positive(message = "Invalid Project ID")
    private Long projectId;

    @NotBlank(message = "Priority is required")
    private String priority; // e.g., Low, Medium, High

    @NotNull(message = "Due date is required")
    @FutureOrPresent
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dueDate;
}
