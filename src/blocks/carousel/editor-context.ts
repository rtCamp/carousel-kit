import { createContext } from '@wordpress/element';
import type { EmblaCarouselType } from 'embla-carousel';
import type { CarouselAttributes } from './types';

export type EditorCarouselContextType = {
	emblaApi: EmblaCarouselType | undefined;
	setEmblaApi: ( api: EmblaCarouselType ) => void;
	canScrollPrev: boolean;
	canScrollNext: boolean;
	setCanScrollPrev: ( value: boolean ) => void;
	setCanScrollNext: ( value: boolean ) => void;
	carouselOptions: Omit<Partial<CarouselAttributes>, 'slidesToScroll'> & {
		slidesToScroll?: number | string;
	};
};

// Use a global singleton to ensure all block bundles share the same Context reference
const defaultValue: EditorCarouselContextType = {
	emblaApi: undefined,
	setEmblaApi: () => {},
	canScrollPrev: false,
	canScrollNext: false,
	setCanScrollPrev: () => {},
	setCanScrollNext: () => {},
	carouselOptions: {},
};

let context = window.__CORE_CAROUSEL_CONTEXT__;
if ( ! context ) {
	context = createContext<EditorCarouselContextType>( defaultValue );
	window.__CORE_CAROUSEL_CONTEXT__ = context;
}

export const EditorCarouselContext = context;
