package com.ssp.repository;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class InviteRequest {

    @NotNull(message = "Project ID is required")
    @Positive(message = "Project ID must be a positive number")
    private Long projectId;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

}
