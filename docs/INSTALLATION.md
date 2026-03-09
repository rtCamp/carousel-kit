# Installation

## Requirements
- WordPress 6.6 or higher
- PHP 8.2 or higher

## Manual Installation
1. Download the `carousel-kit.zip` file from the [Releases](https://github.com/rtCamp/carousel-kit/releases) page.
2. Log in to your WordPress admin dashboard.
3. Go to **Plugins > Add New Plugin**.
4. Click **Upload Plugin**.
5. Select the downloaded `.zip` file and click **Install Now**.
6. Activate the plugin.

## Composer Installation
*Note: This plugin will soon be available via WPackagist. Until then, use the VCS method below:*

1. **Add the repository to `composer.json`:**

   ```json
   "repositories": [
       {
           "type": "vcs",
           "url": "https://github.com/rtCamp/carousel-kit"
       }
   ],
2. Run the installation command:

    ```bash
    composer require rtcamp/carousel-kit:dev-main
    ```
