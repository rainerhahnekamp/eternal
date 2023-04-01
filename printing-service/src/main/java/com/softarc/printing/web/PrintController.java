package com.softarc.printing.web;

import com.softarc.printing.web.request.AddPrintJob;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/order")
public class PrintController {
    @PostMapping
    public ResponseEntity<Boolean> print(@RequestBody AddPrintJob addPrintJob) {
        if ("Graz".equals(addPrintJob.name())) {
            return ResponseEntity.internalServerError().build();
        } else {
            return ResponseEntity.ok(true);
        }
    }
}
