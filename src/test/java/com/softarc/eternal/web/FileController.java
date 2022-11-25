package com.softarc.eternal.web;

import java.nio.file.Path;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/download")
public class FileController {

  @GetMapping("/download/{path}")
  public void download(@PathVariable String path) {
    Path.of("", "filestore", path);
  }

  @GetMapping("/view/{path}")
  public void view(@PathVariable String path) {}
}
