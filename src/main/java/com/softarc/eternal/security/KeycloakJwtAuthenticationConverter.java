package com.softarc.eternal.security;

import static java.util.Collections.emptySet;
import static java.util.stream.Collectors.toSet;

import java.util.*;
import java.util.stream.Stream;
import lombok.AllArgsConstructor;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;

public class KeycloakJwtAuthenticationConverter
    implements Converter<Jwt, AbstractAuthenticationToken> {
  @Override
  public AbstractAuthenticationToken convert(Jwt source) {
    return new JwtAuthenticationToken(
        source,
        Stream.concat(
                new JwtGrantedAuthoritiesConverter().convert(source).stream(),
                extractResourceRoles(source).stream())
            .collect(toSet()));
  }

  private Collection<? extends GrantedAuthority> extractResourceRoles(Jwt jwt) {
    var resourceAccess = new HashMap<>(jwt.getClaim("resource_access"));

    var eternal = (Map<String, List<String>>) resourceAccess.get("eternal");

    var roles = (ArrayList<String>) eternal.get("roles");

    return roles.stream()
        .map(role -> new SimpleGrantedAuthority("ROLE_" + role.replace("-", "_")))
        .collect(toSet());
  }
}
