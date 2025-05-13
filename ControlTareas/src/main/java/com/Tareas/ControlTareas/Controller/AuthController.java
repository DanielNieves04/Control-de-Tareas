package com.Tareas.ControlTareas.Controller;

import com.Tareas.ControlTareas.Entity.models.AuthResponse;
import com.Tareas.ControlTareas.Entity.models.LoginRequest;
import com.Tareas.ControlTareas.Entity.models.RegisterRequest;
import com.Tareas.ControlTareas.Service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
