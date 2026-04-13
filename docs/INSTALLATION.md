# Installation

## Requirements
- WordPress 6.6 or higher
- PHP 8.2 or higher

## Manual Installation
1. Download the `rt-carousel.zip` file from the [Releases](https://github.com/rtCamp/rt-carousel/releases) page.
2. Log in to your WordPress admin dashboard.
3. Go to **Plugins > Add New Plugin**.
4. Click **Upload Plugin**.
5. Select the downloaded `.zip` file and click **Install Now**.
6. Activate the plugin.

## Composer Installation
*Note: If this plugin is not available via WPackagist, use the VCS method below:*

1. **Add the repository to your existing `composer.json`:**

   ```json
    "repositories": [
        {
            "type": "vcs",
            "url": "https://github.com/rtCamp/rt-carousel"
        }
    ]
   ```

2. **Run the installation command (stable release):**

   ```bash
   composer require rtcamp/rt-carousel:^2.0
   ```
