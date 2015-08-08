BIN = ./node_modules/.bin
TESTS = $(shell find ./src -type f -name '*-test.js')

.PHONY: bootstrap test lint

lint:
	@$(BIN)/standard

test: lint
	@NODE_ENV=test $(BIN)/mocha $(TESTS)

test-watch:
	@NODE_ENV=test $(BIN)/mocha --watch $(TESTS)

test-debug:
	@NODE_ENV=test $(BIN)/mocha --debug-brk $(TESTS)
