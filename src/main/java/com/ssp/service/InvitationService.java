package com.ssp.service;

import com.ssp.model.Invitation;

public interface InvitationService {

    public void sendInvitation(String email, Long projectId) throws Exception;

    public Invitation acceptInvitation(String token, Long userId) throws Exception;

    public String getTokenByUserMail(String userEmail);

    public void deleteToken(String token);

}
