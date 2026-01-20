package com.example.information.service;

import com.example.information.entities.Usuario;
import com.example.information.model.AuthResponse;
import com.example.information.model.LoginRequest;
import com.example.information.model.RegisterRequest;
import com.example.information.model.UsuarioDTO;
import com.example.information.repositories.UsuarioRepository;
import com.example.information.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validar que username no exista
        if (usuarioRepository.existsByUsername(request.getUsername())) {
            return new AuthResponse(null, null, null, null, "El nombre de usuario ya existe");
        }

        // Validar que email no exista
        if (usuarioRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(null, null, null, null, "El email ya está registrado");
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setUsername(request.getUsername());
        usuario.setEmail(request.getEmail());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setEnabled(true);
        
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_USER");
        usuario.setRoles(roles);

        usuario = usuarioRepository.save(usuario);

        // Generar token
        String token = jwtUtil.generateToken(usuario.getUsername());

        return new AuthResponse(
            usuario.getId(),
            usuario.getUsername(),
            usuario.getEmail(),
            token,
            "Registro exitoso"
        );
    }

    public AuthResponse login(LoginRequest request) {
        Optional<Usuario> optUsuario = usuarioRepository.findByUsername(request.getUsername());
        
        if (optUsuario.isEmpty()) {
            return new AuthResponse(null, null, null, null, "Usuario no encontrado");
        }

        Usuario usuario = optUsuario.get();

        if (!passwordEncoder.matches(request.getPassword(), usuario.getPassword())) {
            return new AuthResponse(null, null, null, null, "Contraseña incorrecta");
        }

        if (!usuario.isEnabled()) {
            return new AuthResponse(null, null, null, null, "Usuario deshabilitado");
        }

        // Generar token
        String token = jwtUtil.generateToken(usuario.getUsername());

        return new AuthResponse(
            usuario.getId(),
            usuario.getUsername(),
            usuario.getEmail(),
            token,
            "Login exitoso"
        );
    }

    public Optional<Usuario> findById(Long id) {
        return usuarioRepository.findById(id);
    }

    public Optional<Usuario> findByUsername(String username) {
        return usuarioRepository.findByUsername(username);
    }

    public UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(
            usuario.getId(),
            usuario.getUsername(),
            usuario.getEmail(),
            usuario.isEnabled()
        );
    }
}
