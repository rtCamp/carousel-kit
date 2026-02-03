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
		label: __( 'Default (100%)', 'core-carousel' ),
		isDefault: true,
	},
	{ name: 'columns-2', label: __( '2 Columns (50%)', 'core-carousel' ) },
	{ name: 'columns-3', label: __( '3 Columns (33%)', 'core-carousel' ) },
	{ name: 'columns-4', label: __( '4 Columns (25%)', 'core-carousel' ) },
];

styles.forEach( ( style ) => registerBlockStyle( metadata.name, style ) );
