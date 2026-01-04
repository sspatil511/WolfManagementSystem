package com.ssp.request;

import lombok.Data;

@Data
public class CreateCommentRequest {

    private Long issueId;

    private String content;
}
