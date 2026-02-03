import type { EditorCarouselContextType } from './blocks/carousel/editor-context';
import type React from 'react';

declare global {
    interface Window {
        __CORE_CAROUSEL_CONTEXT__?: React.Context<EditorCarouselContextType>;
    }
}

export {};
