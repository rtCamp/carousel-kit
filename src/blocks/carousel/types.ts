import type { EmblaOptionsType } from 'embla-carousel';
import type { BlockVerticalAlignmentToolbar } from '@wordpress/block-editor';

export type CarouselAttributes = {
	loop: boolean;
	dragFree: boolean;
	carouselAlign: 'start' | 'center' | 'end';
	align?: 'start' | 'center' | 'end'; // Add align property optional
	containScroll: 'trimSnaps' | 'keepSnaps';
	direction: 'ltr' | 'rtl';
	axis: 'x' | 'y';
	height: string;
	allowedSlideBlocks: string[];
	autoplay: boolean;
	autoplayDelay: number;
	autoplayStopOnInteraction: boolean;
	autoplayStopOnMouseEnter: boolean;
	ariaLabel: string;
	slideGap: number;
	slidesToScroll: string;
};

export type CarouselViewportAttributes = Record<string, never>;
export type CarouselSlideAttributes = {
	verticalAlignment?: BlockVerticalAlignmentToolbar.Value;
};
export type CarouselControlsAttributes = Record<string, never>;
export type CarouselDotsAttributes = Record<string, never>;

/**
 * Typed subset of the block editor store selectors used in this plugin.
 * This avoids `as any` casts while keeping dot-notation and type safety.
 */
export interface BlockEditorSelectors {
	getBlocks: ( clientId: string ) => Array<{ clientId: string; name: string; attributes: Record<string, unknown>; innerBlocks: ReturnType<BlockEditorSelectors['getBlocks']> }>;
	getSelectedBlockClientId: () => string | null;
	getBlockParents: ( clientId: string ) => string[];
}

export type CarouselContext = {
	options: EmblaOptionsType & {
		slidesToScroll?: number | 'auto';
	};
	autoplay:
		| boolean
		| {
				delay: number;
				stopOnInteraction: boolean;
				stopOnMouseEnter: boolean;
		};
	isPlaying: boolean;
	timerIterationId: number;
	selectedIndex: number;
	scrollSnaps: { index: number }[];
	canScrollPrev: boolean;
	canScrollNext: boolean;
	ariaLabelPattern: string;
	ref?: HTMLElement | null;
	initialized?: boolean; // Internal state to track if the carousel has been initialized. See: https://github.com/rtCamp/carousel-kit/issues/78
};
