import { useBlockProps, useInnerBlocksProps } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { CarouselAttributes, CarouselContext } from "./types";

export default function Save({
	attributes,
}: {
	attributes: CarouselAttributes;
}) {
	const {
		loop,
		dragFree,
		carouselAlign,
		containScroll,
		direction,
		autoplay,
		autoplayDelay,
		autoplayStopOnInteraction,
		autoplayStopOnMouseEnter,
		ariaLabel,
		slideGap,
		axis,
		height,
	} = attributes;

	// Pass configuration to the frontend via data-wp-context
	const context: CarouselContext = {
		options: { loop, dragFree, align: carouselAlign, containScroll, direction, axis },
		autoplay: autoplay
			? {
					delay: autoplayDelay,
					stopOnInteraction: autoplayStopOnInteraction,
					stopOnMouseEnter: autoplayStopOnMouseEnter,
				}
			: false,
		isPlaying: !!autoplay, // Initially true if autoplay is enabled
		timerIterationId: 0,
		selectedIndex: -1,
		scrollSnaps: [],
		canScrollPrev: false,
		canScrollNext: false,
		ariaLabelPattern: __("Go to slide %d", "carousel-system-interactivity-api"),
	};

	const blockProps = useBlockProps.save({
		className: "rt-carousel",
		role: "region",
		"aria-roledescription": "carousel",
		"aria-label": ariaLabel,
		dir: direction,
		"data-axis": axis,
		"data-wp-interactive": "carousel-system/carousel",
		"data-wp-context": JSON.stringify(context),
		"data-wp-init": "callbacks.initCarousel", // Use init for mounting
		style: {
			"--rt-carousel-gap": `${slideGap}px`,
			"--rt-carousel-height": axis === "y" ? height : undefined,
		} as React.CSSProperties,
	});

	const innerBlocksProps = useInnerBlocksProps.save(blockProps);

	return <div {...innerBlocksProps} />;
}
