import type { EditorCarouselContextType } from './blocks/carousel/editor-context';
import type React from 'react';

declare global {
    interface Window {
        __RT_CAROUSEL_CONTEXT__?: React.Context<EditorCarouselContextType>;
    }
}

export {};
