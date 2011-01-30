NODE = node

test: test_api test_parallel test_serial test_stubs

test_api:
	@$(NODE) tests/test.js

test_parallel:
	@$(NODE) tests/parallel.js

test_serial:
	@$(NODE) tests/serial.js

test_stubs:
	@$(NODE) tests/stubs.js

test_app:
	@$(NODE) tests/app.js

.PHONY: test
