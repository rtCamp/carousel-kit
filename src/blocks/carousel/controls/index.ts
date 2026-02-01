import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import metadata from './block.json';
import type { CarouselControlsAttributes } from '../types';
import './style.scss';

registerBlockType( metadata as BlockConfiguration<CarouselControlsAttributes>, {
	edit: Edit,
	save: Save,
} );
