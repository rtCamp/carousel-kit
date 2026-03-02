import type { EmblaOptionsType } from 'embla-carousel';

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
export type CarouselSlideAttributes = Record<string, never>;
export type CarouselControlsAttributes = Record<string, never>;
export type CarouselDotsAttributes = Record<string, never>;
export type CarouselCounterAttributes = Record<string, never>;

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
};
