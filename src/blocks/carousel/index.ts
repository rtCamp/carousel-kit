import {
	registerBlockType,
	registerBlockStyle,
	type BlockConfiguration,
} from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';
import './style.scss';
import './editor.scss';
import metadata from './block.json';
import type { CarouselAttributes } from './types';
import { __ } from '@wordpress/i18n';

registerBlockType( metadata as BlockConfiguration<CarouselAttributes>, {
	edit: Edit,
	save: Save,
} );

const styles = [
	{
		name: 'default',
		label: __( 'Default (100%)', 'carousel-kit' ),
		isDefault: true,
	},
	{ name: 'columns-2', label: __( '2 Columns (50%)', 'carousel-kit' ) },
	{ name: 'columns-3', label: __( '3 Columns (33%)', 'carousel-kit' ) },
	{ name: 'columns-4', label: __( '4 Columns (25%)', 'carousel-kit' ) },
];

styles.forEach( ( style ) => registerBlockStyle( metadata.name, style ) );
