# Kommentarer

# Variabler
PNPM = pnpm
GO = go
BUILD_DIR = build
SERVER_BIN = server

install:
	$(PNPM) install

build:
	$(PNPM) build

web: install build
	$(PNPM) start &

build_server:
	$(GO) build -o $(SERVER_BIN) ./server/main.go

server: build_server
	./$(SERVER_BIN) &

clean:
	rm -rf $(BUILD_DIR) $(SERVER_BIN)

.PHONY: install build web build_server server clean

all: install build build_server
