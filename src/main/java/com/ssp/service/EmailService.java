package com.ssp.service;

public interface EmailService {

    public void sendEmailWithToken(String userEmail, String link) throws Exception;
}
