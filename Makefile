# Configuration
PLUGIN_SLUG := core-carousel
PLUGIN_VERSION := 1.0.0
BUILD_DIR := build-dist
ZIP_NAME := $(PLUGIN_SLUG).zip

# Default target
.PHONY: all
all: build zip

# Production Build (Slow, Clean)
# Uses 'npm ci' to wipe node_modules and ensure exact versions.
.PHONY: build
build:
	@echo "Installing Composer dependencies (Production)..."
	@composer install --no-dev --optimize-autoloader
	@echo "Installing NPM dependencies (Clean)..."
	@npm ci
	@echo "Building assets..."
	@npm run build

# Development Build (Fast, Incremental)
# Uses 'npm install' to respect existing node_modules.
.PHONY: dev
dev:
	@echo "Installing Composer dependencies..."
	@composer install
	@echo "Installing NPM dependencies (Incremental)..."
	@npm install
	@echo "Building assets..."
	@npm run build

# Production Build & Zip (Slow, for Releases)
.PHONY: zip
zip: build dist

# Development Build & Zip (Fast, for Testing)
.PHONY: quick-zip
quick-zip: dev dist

# Internal target for creating the distribution package
.PHONY: dist
dist:
	@echo "Creating distribution package..."
	@rm -rf $(BUILD_DIR)
	@mkdir -p $(BUILD_DIR)/$(PLUGIN_SLUG)
	
	@# Copy Files
	@rsync -r \
		--exclude='.*' \
		--exclude='node_modules' \
		--exclude='tests' \
		--exclude='phpunit.xml.dist' \
		--exclude='phpcs.xml.dist' \
		--exclude='webpack.config.js' \
		--exclude='package.json' \
		--exclude='package-lock.json' \
		--exclude='tsconfig.json' \
		--exclude='composer.json' \
		--exclude='composer.lock' \
		--exclude='Makefile' \
		--exclude='README.md' \
		--exclude='CHANGELOG.md' \
		--exclude='src' \
		--exclude='$(BUILD_DIR)' \
		--exclude='*.zip' \
		./ $(BUILD_DIR)/$(PLUGIN_SLUG)/
	
	@echo "Zipping..."
	@cd $(BUILD_DIR) && zip -r ../$(ZIP_NAME) $(PLUGIN_SLUG)
	@echo "Done! Plugin zip created at $(ZIP_NAME)"
	@rm -rf $(BUILD_DIR)

# Clean up
.PHONY: clean
clean:
	@rm -f $(ZIP_NAME)
	@rm -rf $(BUILD_DIR)
	@rm -rf build
	@rm -rf node_modules
	@rm -rf vendor

# Local GitHub Actions simulation
.PHONY: act
act:
	@act -W .github/workflows/release.yml
