import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import type { CarouselCounterAttributes } from '../types';
import './style.scss';

registerBlockType( metadata as BlockConfiguration<CarouselCounterAttributes>, {
	edit: Edit,
	save: Save,
} );
