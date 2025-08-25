package com.Java_AWS_Project.goal;

import com.Java_AWS_Project.goal.Goal;
import com.Java_AWS_Project.goal.GoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @PostMapping
    public ResponseEntity<?> createGoal(@Valid @RequestBody Goal goal) {
        try {
            Goal savedGoal = goalService.createGoal(goal);
            return new ResponseEntity<>(savedGoal, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "Cannot create goal: Client validation failed");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<?> getGoalsByClient(@PathVariable Long clientId) {
        try {
            List<Goal> goals = goalService.getGoalsByClient(clientId);
            return new ResponseEntity<>(goals, HttpStatus.OK);

        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "Cannot fetch goals: Client validation failed");
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGoalById(@PathVariable Long id) {
        try {
            Goal goal = goalService.getGoalById(id);
            return new ResponseEntity<>(goal, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "Goal not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllGoals() {
        try {
            List<Goal> goals = goalService.getAllGoals();
            return new ResponseEntity<>(goals, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(@PathVariable Long id, @Valid @RequestBody Goal goalDetails) {
        try {
            Goal updatedGoal = goalService.updateGoal(id, goalDetails);
            return new ResponseEntity<>(updatedGoal, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "Goal not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {
        try {
            goalService.deleteGoal(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Goal deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("message", "Goal not found");
            return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Internal server error");
            error.put("message", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
