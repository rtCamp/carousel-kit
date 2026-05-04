# Changelog

## [2.0.1](https://github.com/rtCamp/rt-carousel/compare/v2.0.0...v2.0.1) (2026-05-04)


### Features

* add a11y announcements for carousel slide changes ([#125](https://github.com/rtCamp/rt-carousel/issues/125)) ([b7a2240](https://github.com/rtCamp/rt-carousel/commit/b7a2240))


### Bug Fixes

* carousel dot focus loss with VoiceOver activation ([#127](https://github.com/rtCamp/rt-carousel/issues/127)) ([366031e](https://github.com/rtCamp/rt-carousel/commit/366031e))


### Refactors

* replace automatic plugin deactivation with admin notice ([#129](https://github.com/rtCamp/rt-carousel/issues/129)) ([279a464](https://github.com/rtCamp/rt-carousel/commit/279a464))


## [2.0.0](https://github.com/rtCamp/rt-carousel/compare/v1.0.4...v2.0.0) (2026-04-13)


### Bug Fixes

* add initialized state to CarouselContext to track carousel initialization ([#92](https://github.com/rtCamp/rt-carousel/issues/92)) ([71de050](https://github.com/rtCamp/rt-carousel/commit/71de050aae8ff55f82b61a02440f8ccd42b63d76))
* exclude composer.json and composer.lock from distribution package ([#99](https://github.com/rtCamp/rt-carousel/issues/99)) ([a1308c6](https://github.com/rtCamp/rt-carousel/commit/a1308c6581faa68e7b68a4c2e29c78110a1670f9))
* restore vertical scroll for Query Loop carousel ([#104](https://github.com/rtCamp/rt-carousel/issues/104)) ([1d16ee6](https://github.com/rtCamp/rt-carousel/commit/1d16ee6f6ac068524998f33c20fdab39638ead3f))
* **controls:** block toolbar persists when selected block moves out of view in carousel ([#106](https://github.com/rtCamp/rt-carousel/issues/106)) ([dec79c8](https://github.com/rtCamp/rt-carousel/commit/dec79c8))


### Features

* add support for the carousel progress bar ([#88](https://github.com/rtCamp/rt-carousel/issues/88)) ([edc8699](https://github.com/rtCamp/rt-carousel/commit/edc8699))
* support vertical alignment on carousel slide ([#87](https://github.com/rtCamp/rt-carousel/issues/87)) ([f73890e](https://github.com/rtCamp/rt-carousel/commit/f73890e))
* add wp-env configuration for WP development setup ([#109](https://github.com/rtCamp/rt-carousel/issues/109)) ([dcccaf7](https://github.com/rtCamp/rt-carousel/commit/dcccaf79747cf84811a7907e68df01d2aaeb7030))


### Refactors

* rename plugin from "Carousel Kit" to "rtCarousel" with automatic block content migration ([#101](https://github.com/rtCamp/rt-carousel/pull/101)) ([9788ed7](https://github.com/rtCamp/rt-carousel/commit/9788ed7))


## [1.0.4](https://github.com/rtCamp/carousel-kit/compare/v1.0.3...v1.0.4) (2026-03-09)

### Bug Fixes

* clean up .distignore by removing unnecessary files and directories ([353646b](https://github.com/rtCamp/carousel-kit/commit/353646bf85f1d986644fbf1d745688702f4a35e0))
* correct release link in INSTALLATION.md and update node_modules exclusion in phpstan.neon.dist ([1eea8d8](https://github.com/rtCamp/carousel-kit/commit/1eea8d8c4b8ea49a526b871d738dbb91501ffd69))
* CSS linting issues ([1149c55](https://github.com/rtCamp/carousel-kit/commit/1149c55b55056d0171eef66465f9c6e22b02dae4))
* ensure direct access to Autoloader.php exits gracefully ([d33bf17](https://github.com/rtCamp/carousel-kit/commit/d33bf17e1caed94489850677743dcf659caa35de))
* **examples:** swap misplaced editor images and remove hardcoded aspect ratio ([162b07e](https://github.com/rtCamp/carousel-kit/commit/162b07ee577ebe80236ec87172a523307fb4a3de))
* ignore phpcs warning for including pattern file from a fixed directory ([02d49a7](https://github.com/rtCamp/carousel-kit/commit/02d49a7a1468f82670253e7b7c12b861ccc2edd5))
* remove outdated screenshots description from readme ([7ffdd9a](https://github.com/rtCamp/carousel-kit/commit/7ffdd9a1c44d4747b37f25757a91c8dc70e79371))
* **styles:** remove unnecessary grid-template-columns property ([818d69c](https://github.com/rtCamp/carousel-kit/commit/818d69c5537e8ab76ff40df0a255b1c5d182f934))
* update @wordpress/scripts version to allow minor updates ([03ce762](https://github.com/rtCamp/carousel-kit/commit/03ce7623a1597ed8959f2f3f6fa8393e2c01065d))
* update contributors list in plugin header and readme.txt ([295b2b3](https://github.com/rtCamp/carousel-kit/commit/295b2b3787df7c757d383333dbfe84f97a913590))
* update dist target to exclude additional configuration and development files ([71381db](https://github.com/rtCamp/carousel-kit/commit/71381dbca6e7afa216020b69906d811013c0a5bc))
* update file paths in phpcs and phpstan configuration ([4077c28](https://github.com/rtCamp/carousel-kit/commit/4077c28f7aea1ce5de64c18f8948fa943ca8317a))
* update package dependencies for minimatch and serialize-javascript ([6a05ac9](https://github.com/rtCamp/carousel-kit/commit/6a05ac9ea01e17077197bfd09a8335aca627c3aa))
* update package-lock.json to remove unused dependency and upgrade svgo and immutable versions ([c9e877d](https://github.com/rtCamp/carousel-kit/commit/c9e877d164acdffe37d9eb91b5f03bc3cd65b084))
* update POT-Creation-Date and add missing autoloader error message ([3bdc9e0](https://github.com/rtCamp/carousel-kit/commit/3bdc9e06e8fbdbaffd17d8c50a9e6b57dbb44ea3))
* update script paths in composer.json and improve constant definitions in tests ([9c73548](https://github.com/rtCamp/carousel-kit/commit/9c7354831f124705fe3fc8cd56a9c32e6da159bc))
* update script paths in composer.json to use local binaries ([46f0f7a](https://github.com/rtCamp/carousel-kit/commit/46f0f7a2ed3d204a5a479cd6eaee7509a9546640))
* update tested up to version in readme.txt from 6.9.1 to 6.9 ([6a23832](https://github.com/rtCamp/carousel-kit/commit/6a23832624a693ca4a8ef1fd4d7ed9e2ffe4f04d))
* update WordPress minimum requirement to 6.6 in README, INSTALLATION, and readme.txt ([320a3ec](https://github.com/rtCamp/carousel-kit/commit/320a3ec09184f44d823219b3747e3d4c2dc60a1d))

### Features

* add localization support and update package.json for repository and bugs metadata ([2268cb8](https://github.com/rtCamp/carousel-kit/commit/2268cb830b65828c5164133b00af4432fbd7ac29))
* add new screenshot image and remove outdated PNG file ([e1b9e23](https://github.com/rtCamp/carousel-kit/commit/e1b9e2345755ccf94ffd049b9da3c84cc5dac09a))
* add placeholder logos and update hero carousel pattern ([bdd4b52](https://github.com/rtCamp/carousel-kit/commit/bdd4b525217de55385df163ed21095cd302bebbc))
* add readme.txt with plugin details and installation instructions ([e8cdd4a](https://github.com/rtCamp/carousel-kit/commit/e8cdd4a8e77d324cc61068f9be19bd884564b382))
* add screenshot for plugin preview in WordPress.org ([c3826fc](https://github.com/rtCamp/carousel-kit/commit/c3826fc212ad49201fefc0b9ff2106fc163d9232))
* implement autoloader for PHP classes and refactor constant definitions ([a0a1b45](https://github.com/rtCamp/carousel-kit/commit/a0a1b45c8f2f481799c50c34b5bc4eeb13eb34d4))
* update .distignore to exclude README.md and enhance carousel-kit.php for direct access protection ([e5ee596](https://github.com/rtCamp/carousel-kit/commit/e5ee596077a1f3a5d1311823d39db3aa1b2c734e))
* update license and version in carousel-kit.php; add index.php for plugin structure ([4e5fe9f](https://github.com/rtCamp/carousel-kit/commit/4e5fe9f83ae717c14dcc0b21ddac72a81c8662c7))
* update PHP requirement to 8.2 and reorder contributors in plugin header ([3a52e05](https://github.com/rtCamp/carousel-kit/commit/3a52e059d48a864e47c43b89ca006ad9eda0b6f3))
* update README with minimum requirements and add uninstall functionality ([22cb27c](https://github.com/rtCamp/carousel-kit/commit/22cb27cab704d3531e61b2c7351899470fd973f5))
* Updated pot file ([cd5e061](https://github.com/rtCamp/carousel-kit/commit/cd5e06180f91a6a74599dabb1418c14011c90d61))


## [1.0.3](https://github.com/rtCamp/carousel-kit/compare/v1.0.2...v1.0.3) (2026-02-24)


### Bug Fixes

* enable loop on editor ([fe4566a](https://github.com/rtCamp/carousel-kit/commit/fe4566afcf72e1e663c7eb481a7957d62c2d3365))
* state corruption when clicking between slides ([637e4a5](https://github.com/rtCamp/carousel-kit/commit/637e4a507eb2c58576c4004d5460e8aa7295db9f))

## [1.0.2](https://github.com/rtCamp/carousel-kit/compare/v1.0.1...v1.0.2) (2026-02-23)


### Bug Fixes

* **demo:** 4 slides per view ([e13817c](https://github.com/rtCamp/carousel-kit/commit/e13817c8e49e0e071580efbf95ff4c77d677e114))
* replace PNG images with optimized WEBP format ([eb60082](https://github.com/rtCamp/carousel-kit/commit/eb6008251039ea700262c63db89a266072ee6c3f))
* replace urls with webp alts ([000f894](https://github.com/rtCamp/carousel-kit/commit/000f894a9818bd8181977cb038231e0ea3d82386))

### Features

* setup wizard styles ([0be0bf7](https://github.com/rtCamp/carousel-kit/commit/0be0bf7cde8c9035cca1086dce7dce005e0d39b2))
* slide appender and setup ([a42331d](https://github.com/rtCamp/carousel-kit/commit/a42331d10b225379408ddf8c0649e83484496a1e))


## [1.0.1](https://github.com/rtCamp/carousel-kit/compare/v1.0.0...v1.0.1) (2026-02-16)

### Bug Fixes

* **carousel:** resolve spacing issues in loop mode where gaps were missing between last and first slide
* **carousel:** allow infinite loop in editor viewport to match frontend behavior

## 1.0.0 (2026-02-03)


### Bug Fixes

* Gap issue fixed for the carousel items ([5277b89](https://github.com/rtCamp/carousel-kit/commit/5277b89545c973f13c22f6d1d7cf21e19958305f))


### Features

* Add example carousels for hero, logo showcase, and testimonials ([d2b6e4a](https://github.com/rtCamp/carousel-kit/commit/d2b6e4ae0f915f6edfb6ddf637c4a88878375e4b))
* Add slide to scroll option ([f2adab3](https://github.com/rtCamp/carousel-kit/commit/f2adab310015347400a1c2e6437b3a68566a6c9d))
* Enhance vertical axis support and adjust slide dimensions in carousel styles ([2ec3e40](https://github.com/rtCamp/carousel-kit/commit/2ec3e40e8e34655d3417b25e16feaee41451c604))
* Refactor context handling and define global window interface for carousel context ([5aab80e](https://github.com/rtCamp/carousel-kit/commit/5aab80edd103ee66d8e212359eb0f8d2ad01acb7))
