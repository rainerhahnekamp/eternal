package com.softarc.eternal.common;

import java.io.BufferedInputStream;
import java.io.IOException;
import java.io.InputStream;
import org.apache.tika.detect.DefaultDetector;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.mime.MediaType;
import org.springframework.stereotype.Service;

@Service
public class ImageValidator {

  public boolean isFileImage(InputStream inputStream) throws IOException {
    var detector = new DefaultDetector();
    var metadata = new Metadata();
    MediaType mediaType = detector.detect(
      new BufferedInputStream(inputStream),
      metadata
    );

    return "image".equals(mediaType.getType());
  }
}
