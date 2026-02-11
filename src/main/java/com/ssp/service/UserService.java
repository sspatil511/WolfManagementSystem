package com.ssp.service;

import com.ssp.model.User;

public interface UserService {

    User findUserProfileByJwt(String jwt) throws Exception;

    User findUserByEmail(String email) throws Exception;

    User findUserById(Long id) throws Exception;

    User updateUsersNumProjects(User user, int number) throws Exception;

    
}
