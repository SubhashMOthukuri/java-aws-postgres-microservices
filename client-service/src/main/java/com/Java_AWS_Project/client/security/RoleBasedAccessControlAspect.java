package com.Java_AWS_Project.client.security;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

/**
 * Aspect for handling role-based access control in GraphQL operations
 */
@Aspect
@Component
public class RoleBasedAccessControlAspect {
    
    /**
     * Check role requirements before executing GraphQL methods
     */
    @Before("@annotation(requireRole)")
    public void checkRoleAccess(JoinPoint joinPoint, RequireRole requireRole) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Authentication required");
        }
        
        // Get user roles from authentication
        List<String> userRoles = authentication.getAuthorities().stream()
                .map(authority -> authority.getAuthority().replace("ROLE_", ""))
                .toList();
        
        // Check if user has any of the required roles
        String[] requiredRoles = requireRole.value();
        boolean hasRequiredRole = Arrays.stream(requiredRoles)
                .anyMatch(requiredRole -> userRoles.contains(requiredRole));
        
        if (!hasRequiredRole) {
            throw new SecurityException("Insufficient privileges. Required roles: " + Arrays.toString(requiredRoles));
        }
    }
}
