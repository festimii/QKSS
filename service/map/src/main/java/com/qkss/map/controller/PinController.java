package com.qkss.map.controller;

import com.qkss.map.dto.CreatePinDTO;
import com.qkss.map.dto.PinDTO;
import com.qkss.map.service.PinService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/pins")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://127.0.0.1:5500")  // adjust as needed
public class PinController {
    private final PinService service;

    // 1) Public endpoint: list all pins
    @GetMapping
    public List<PinDTO> getPins() {
        return service.listPins();
    }

    // 1b) Public endpoint: get pin by ID
    @GetMapping("/{id}")
    public ResponseEntity<PinDTO> getPin(@PathVariable String id) {
        return ResponseEntity.ok(service.getPin(id));
    }

    // 2) Login endpoint: accepts {"password":"admin123"}, returns raw JWT
    @PostMapping("/admin/login")
    public ResponseEntity<String> login(@RequestBody Map<String, String> body) {
        String pw = body.get("password");
        System.out.println(">>> Received password: [" + pw + "]");

        if (pw == null || !"admin123".equals(pw.trim())) {
            System.out.println(">>> REJECTED");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        System.out.println(">>> ACCEPTED, generating JWT");
        String token = JwtUtil.generateToken("admin");
        System.out.println(">>> Generated JWT: " + token);
        return ResponseEntity.ok(token);
    }

    // 3) Create pin: requires Authorization: Bearer <jwt>
    @PostMapping("/admin")
    public ResponseEntity<PinDTO> add(
            @RequestBody @Valid CreatePinDTO dto,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        System.out.println(">>> Received POST /api/pins/admin, Authorization = " + authHeader);

        if (!isTokenValid(authHeader)) {
            System.out.println(">>> isTokenValid returned FALSE");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        System.out.println(">>> isTokenValid returned TRUE");
        return ResponseEntity.ok(service.createPin(dto));
    }

    // 4) Delete pin by ID
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> delete(
            @PathVariable String id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        System.out.println(">>> Received DELETE /api/pins/admin/" + id + ", Authorization = " + authHeader);
        if (!isTokenValid(authHeader)) {
            System.out.println(">>> isTokenValid returned FALSE");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        System.out.println(">>> isTokenValid returned TRUE");
        service.deletePin(id);
        return ResponseEntity.ok().build();
    }

    // 5) Simple health‐check for admin endpoints
    @GetMapping("/admin/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Admin API reachable");
    }

    // Single, unified isTokenValid method
    private boolean isTokenValid(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println(">>> Missing or malformed Authorization header: " + authHeader);
            return false;
        }
        String token = authHeader.substring(7).trim();
        System.out.println(">>> Validating JWT token = " + token);
        boolean valid = JwtUtil.validateToken(token);
        System.out.println(">>> JwtUtil.validateToken returned " + valid);
        return valid;
    }
}
