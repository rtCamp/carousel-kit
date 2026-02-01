import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import type { CarouselViewportAttributes } from '../types';

registerBlockType( metadata as BlockConfiguration<CarouselViewportAttributes>, {
	edit: Edit,
	save: Save,
} );
