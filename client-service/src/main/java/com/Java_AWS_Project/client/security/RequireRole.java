package com.Java_AWS_Project.client.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Custom annotation for role-based access control in GraphQL operations
 * Usage: @RequireRole("ADMIN") or @RequireRole({"USER", "ADMIN"})
 */
@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface RequireRole {
    String[] value();
}
