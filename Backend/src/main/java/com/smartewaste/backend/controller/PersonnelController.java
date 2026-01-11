package com.smartewaste.backend.controller;

import com.smartewaste.backend.entity.Personnel;
import com.smartewaste.backend.service.PersonnelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/personnel")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class PersonnelController {

    private final PersonnelService personnelService;

    public PersonnelController(PersonnelService personnelService) {
        this.personnelService = personnelService;
    }

    @GetMapping
    public ResponseEntity<List<Personnel>> getAllPersonnel() {
        return ResponseEntity.ok(personnelService.getAllActivePersonnel());
    }

    @PostMapping
    public ResponseEntity<Personnel> addPersonnel(@RequestBody Personnel personnel) {
        return ResponseEntity.ok(personnelService.addPersonnel(personnel));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonnel(@PathVariable Long id) {
        personnelService.deletePersonnel(id);
        return ResponseEntity.ok().build();
    }
}
