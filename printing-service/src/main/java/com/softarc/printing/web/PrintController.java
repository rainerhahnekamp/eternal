package com.softarc.printing.web;

import com.softarc.printing.web.request.AddPrintJob;
import jakarta.websocket.server.PathParam;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/order")
public class PrintController {

  private final RabbitTemplate rabbitTemplate;

  public PrintController(RabbitTemplate rabbitTemplate) {
    this.rabbitTemplate = rabbitTemplate;
  }

  @PostMapping
  public ResponseEntity<Boolean> print(@RequestBody AddPrintJob addPrintJob) {
    if ("Graz".equals(addPrintJob.name())) {
      return ResponseEntity.internalServerError().build();
    } else {
      return ResponseEntity.ok(true);
    }
  }

  @PostMapping("printed/{id}")
  public Boolean printed(@PathVariable Long id) {
    rabbitTemplate.convertAndSend(
      "printing-events",
      "printing.routing",
      id.toString()
    );
    return true;
  }
}
