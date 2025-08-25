package com.Java_AWS_Project.goal;

import com.Java_AWS_Project.goal.Goal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoalRepository extends JpaRepository<Goal, Long> {
    List<Goal> findByClientId(Long clientId);
}
