package com.example.information.security;

import com.example.information.entities.Usuario;
import com.example.information.repositories.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Filtro de autenticación JWT que intercepta todas las peticiones HTTP
 * y valida el token JWT en el header Authorization.
 * 
 * Este filtro:
 * 1. Extrae el token del header "Authorization: Bearer <token>"
 * 2. Valida el token usando JwtUtil
 * 3. Si es válido, establece la autenticación en el SecurityContext
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Obtener el header Authorization
        final String authorizationHeader = request.getHeader("Authorization");
        
        String username = null;
        String jwt = null;
        
        // Verificar si el header existe y comienza con "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            try {
                username = jwtUtil.extractUsername(jwt);
            } catch (Exception e) {
                // Token inválido o expirado - continuar sin autenticar
                logger.warn("Token JWT inválido: " + e.getMessage());
            }
        }
        
        // Si tenemos un username y no hay autenticación previa
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Buscar el usuario en la base de datos
            Optional<Usuario> optUsuario = usuarioRepository.findByUsername(username);
            
            if (optUsuario.isPresent()) {
                Usuario usuario = optUsuario.get();
                
                // Validar el token
                if (jwtUtil.validateToken(jwt, username) && usuario.isEnabled()) {
                    // Crear el token de autenticación con los roles del usuario
                    var authorities = usuario.getRoles().stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());
                    
                    UsernamePasswordAuthenticationToken authToken = 
                            new UsernamePasswordAuthenticationToken(usuario, null, authorities);
                    
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    
                    // Establecer la autenticación en el contexto de seguridad
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }
        
        // Continuar con el siguiente filtro
        filterChain.doFilter(request, response);
    }
}
