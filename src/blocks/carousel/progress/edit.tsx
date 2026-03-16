import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { useContext } from '@wordpress/element';
import { EditorCarouselContext } from '../editor-context';

export default function Edit() {
	const blockProps = useBlockProps( {
		className: 'carousel-kit-progress',
	} );

	const { scrollProgress } = useContext( EditorCarouselContext ) as { scrollProgress?: number };

	return (
		<div { ...blockProps }>
			<div
				className="carousel-kit-progress__bar"
				style={ {
					width: `${ ( scrollProgress || 0 ) * 100 }%`,
				} }
			/>
		</div>
	);
}
