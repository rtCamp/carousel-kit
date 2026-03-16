import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import type { CarouselProgressAttributes } from '../types';
import './style.scss';

registerBlockType( metadata as BlockConfiguration<CarouselProgressAttributes>, {
	edit: Edit,
	save: Save,
} );
