import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import type { CarouselSlideAttributes } from '../types';

registerBlockType( metadata as BlockConfiguration<CarouselSlideAttributes>, {
	edit: Edit,
	save: Save,
} );
