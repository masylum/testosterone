NODE = node

test: test_api test_serial test_stubs test_sync test_async

test_app:
	@$(NODE) tests/app.js

test_api:
	@$(NODE) tests/test.js

test_serial:
	@$(NODE) tests/serial.js

test_stubs:
	@$(NODE) tests/stubs.js

test_sync:
	@$(NODE) tests/sync.js

test_async:
	@$(NODE) tests/async.js

.PHONY: test
