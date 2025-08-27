package com.Java_AWS_Project.client;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AppUser, Long> {
    
    /**
     * Find user by username
     */
    Optional<AppUser> findByUsername(String username);
    
    /**
     * Find user by email
     */
    Optional<AppUser> findByEmail(String email);
    
    /**
     * Check if username exists
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);
    
    /**
     * Find user by username and check if active
     */
    Optional<AppUser> findByUsernameAndIsActiveTrue(String username);
}
