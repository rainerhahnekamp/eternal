package com.softarc.eternal.multimedia;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import com.softarc.eternal.common.ImageValidator;
import java.io.IOException;
import org.junit.jupiter.api.Test;
import org.springframework.core.io.ClassPathResource;

class ImageValidatorTest {

  @Test
  public void testFilesWithoutExtension() throws IOException {
    var validator = new ImageValidator();
    var imageResource = new ClassPathResource("london");
    assertThat(validator.isFileImage(imageResource.getInputStream())).isTrue();

    var textResource = new ClassPathResource("london");
    assertThat(validator.isFileImage(textResource.getInputStream())).isTrue();
  }
}
