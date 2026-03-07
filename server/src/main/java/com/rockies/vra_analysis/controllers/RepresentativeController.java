package com.rockies.vra_analysis.controllers;

import com.rockies.vra_analysis.models.Representative;
import com.rockies.vra_analysis.repositories.RepresentativeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/representatives")
public class RepresentativeController {

    @Autowired
    private RepresentativeRepository repository;

    @GetMapping
    public List<Representative> getAll() {
        return repository.findAll();
    }

    @GetMapping("/state/{state}")
    public List<Representative> getByState(@PathVariable String state) {
        return repository.findByState(state);
    }
}