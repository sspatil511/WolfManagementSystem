package com.ssp.request;

import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Validated
@Data
public class CreateCommentRequest {

    @NotNull(message = "Issue ID is required")
    @Positive(message = "Issue ID must be a positive number")
    private Long issueId;

    @NotBlank(message = "Comment cannot be blank")
    private String content;
}
