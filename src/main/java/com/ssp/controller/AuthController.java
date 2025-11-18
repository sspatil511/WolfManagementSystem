package com.ssp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ssp.config.JwtProvider;
import com.ssp.model.User;
import com.ssp.request.LoginRequest;
import com.ssp.repository.UserRepository;
import com.ssp.response.AuthResponse;
import com.ssp.service.CustomUserDetailsImpl;

@RestController
@RequestMapping("/auth")

public class AuthController {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private CustomUserDetailsImpl customUserDetailsImpl;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody User user) throws Exception {
        
        User isUserExist = userRepository.findByEmail(user.getEmail());
        if(isUserExist != null){
            throw new RuntimeException("User already exists");

        }

        User createdUser = new User();
        createdUser.setPassword(passwordEncoder.encode(user.getPassword()));
        createdUser.setEmail(user.getEmail());
        createdUser.setFullName(user.getFullName());

        User savedUser = userRepository.save(createdUser);

        Authentication authentication = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        String jwt = JwtProvider.generateToken(authentication);
        
        AuthResponse res = new AuthResponse();
        res.setMessage("User registered successfully");
        res.setJwt(jwt);
        
        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }  
    
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signin(@RequestBody LoginRequest loginRequest){
        
        String username = loginRequest.getEmail();
        String password = loginRequest.getPassword();

        Authentication authentication = authenticate(username, password);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = JwtProvider.generateToken(authentication);
        
        AuthResponse res = new AuthResponse();
        res.setMessage("Signed in successfully");
        res.setJwt(jwt);
        
        return new ResponseEntity<>(res, HttpStatus.CREATED);

    }

    private Authentication authenticate(String username, String password){

        UserDetails userDetails = customUserDetailsImpl.loadUserByUsername(username);

        if(userDetails == null){
            throw new BadCredentialsException("Invalid username");
        }

        if(!passwordEncoder.matches(password, userDetails.getPassword())){
            throw new BadCredentialsException("Invalid password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
    }
}
