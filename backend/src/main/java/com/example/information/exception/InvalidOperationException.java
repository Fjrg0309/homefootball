package com.example.information.exception;

public class InvalidOperationException extends RuntimeException {

    private final String operation;
    private final String reason;

    public InvalidOperationException(String operation, String reason) {
        super(String.format("Operación inválida '%s': %s", operation, reason));
        this.operation = operation;
        this.reason = reason;
    }

    public InvalidOperationException(String message) {
        super(message);
        this.operation = null;
        this.reason = message;
    }

    public String getOperation() {
        return operation;
    }

    public String getReason() {
        return reason;
    }
}
