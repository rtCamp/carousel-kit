import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InspectorAdvancedControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	FormTokenField,
	BaseControl,
	TextControl,
	RangeControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useState, useMemo } from '@wordpress/element';
import type { CarouselAttributes } from './types';
import type { BlockConfiguration, Template } from '@wordpress/blocks';
import { EditorCarouselContext } from './editor-context';
import type { EmblaCarouselType } from 'embla-carousel';

const TEMPLATE: Template[] = [
	[ 'core-carousel/carousel-viewport', {} ],
	[ 'core-carousel/carousel-controls', {} ],
];

export default function Edit( {
	attributes,
	setAttributes,
}: {
	attributes: CarouselAttributes;
	setAttributes: ( attrs: Partial<CarouselAttributes> ) => void;
} ) {
	const {
		loop,
		dragFree,
		carouselAlign,
		containScroll,
		direction,
		axis,
		height,
		allowedSlideBlocks,
		autoplay,
		autoplayDelay,
		autoplayStopOnInteraction,
		autoplayStopOnMouseEnter,
		ariaLabel,
		slidesToScroll = '1',
	} = attributes;

	const [ emblaApi, setEmblaApi ] = useState<EmblaCarouselType | undefined>();
	const [ canScrollPrev, setCanScrollPrev ] = useState( false );
	const [ canScrollNext, setCanScrollNext ] = useState( false );

	// Fetch all registered block types for suggestions
	const blockTypes = useSelect( ( select ) => {
		return (
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			select( 'core/blocks' ) as any
		).getBlockTypes() as BlockConfiguration[];
	}, [] );

	const suggestions = blockTypes?.map( ( block ) => block.name ) || [];

	const blockProps = useBlockProps( {
		className: 'core-carousel',
		dir: direction,
		'data-axis': axis,
		style: {
			'--core-carousel-gap': `${ attributes.slideGap }px`,
			'--core-carousel-height': axis === 'y' ? height : undefined,
		} as React.CSSProperties,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	// Memoize carouselOptions separately to prevent excessive viewport reinitializations
	const carouselOptions = useMemo(
		() => ( {
			loop,
			dragFree,
			align: carouselAlign,
			containScroll,
			direction,
			axis,
			height,
			slidesToScroll: slidesToScroll === 'auto' ? 'auto' : parseInt( slidesToScroll, 10 ),
		} ),
		[ loop, dragFree, carouselAlign, containScroll, direction, axis, height, slidesToScroll ],
	);

	// Memoize the context value to prevent infinite re-renders in children
	// Note: setState functions are stable and don't need to be in dependencies
	const contextValue = useMemo(
		() => ( {
			emblaApi,
			setEmblaApi,
			canScrollPrev,
			setCanScrollPrev,
			canScrollNext,
			setCanScrollNext,
			carouselOptions,
		} ),
		[
			emblaApi,
			canScrollPrev,
			canScrollNext,
			carouselOptions,
			setEmblaApi,
			setCanScrollPrev,
			setCanScrollNext,
		],
	);

	return (
		<EditorCarouselContext.Provider value={ contextValue }>
			<InspectorControls>
				<PanelBody title={ __( 'Carousel Settings', 'core-carousel' ) }>
					<ToggleControl
						label={ __( 'Loop', 'core-carousel' ) }
						checked={ loop }
						onChange={ ( value ) => setAttributes( { loop: value } ) }
						help={ __(
							'Infinite scrolling of slides (Frontend only). Disabled in editor for stability.',
							'core-carousel',
						) }
					/>
					<ToggleControl
						label={ __( 'Free Drag', 'core-carousel' ) }
						checked={ dragFree }
						onChange={ ( value ) => setAttributes( { dragFree: value } ) }
						help={ __( 'Enables momentum scrolling.', 'core-carousel' ) }
					/>
					<SelectControl
						label={ __( 'Alignment', 'core-carousel' ) }
						value={ carouselAlign }
						options={ [
							{ label: __( 'Start', 'core-carousel' ), value: 'start' },
							{ label: __( 'Center', 'core-carousel' ), value: 'center' },
							{ label: __( 'End', 'core-carousel' ), value: 'end' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								carouselAlign: value as CarouselAttributes['carouselAlign'],
							} )
						}
					/>
					<SelectControl
						label={ __( 'Contain Scroll', 'core-carousel' ) }
						value={ containScroll }
						options={ [
							{ label: __( 'Trim Snaps', 'core-carousel' ), value: 'trimSnaps' },
							{ label: __( 'Keep Snaps', 'core-carousel' ), value: 'keepSnaps' },
							{ label: __( 'None', 'core-carousel' ), value: '' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								containScroll: value as CarouselAttributes['containScroll'],
							} )
						}
						help={ __(
							'Prevents excess scrolling at the beginning or end.',
							'core-carousel',
						) }
					/>
					<ToggleControl
						label={ __( 'Scroll Auto', 'core-carousel' ) }
						checked={ slidesToScroll === 'auto' }
						onChange={ ( isAuto ) => setAttributes( { slidesToScroll: isAuto ? 'auto' : '1' } ) }
						help={ __( 'Scrolls the number of slides currently visible in the viewport.', 'core-carousel' ) }
					/>
					{ slidesToScroll !== 'auto' && (
						<RangeControl
							label={ __( 'Slides to Scroll', 'core-carousel' ) }
							value={ parseInt( slidesToScroll, 10 ) || 1 }
							onChange={ ( value ) =>
								setAttributes( { slidesToScroll: ( value || 1 ).toString() } )
							}
							min={ 1 }
							max={ 10 }
						/>
					) }
					<SelectControl
						label={ __( 'Direction', 'core-carousel' ) }
						value={ direction }
						options={ [
							{ label: __( 'Left to Right (LTR)', 'core-carousel' ), value: 'ltr' },
							{ label: __( 'Right to Left (RTL)', 'core-carousel' ), value: 'rtl' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								direction: value as CarouselAttributes['direction'],
							} )
						}
						help={ __(
							'Choose content direction. RTL is typically used for Arabic, Hebrew, and other right-to-left languages.',
							'core-carousel',
						) }
					/>
					<SelectControl
						label={ __( 'Orientation', 'core-carousel' ) }
						value={ axis }
						options={ [
							{ label: __( 'Horizontal', 'core-carousel' ), value: 'x' },
							{ label: __( 'Vertical', 'core-carousel' ), value: 'y' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								axis: value as CarouselAttributes['axis'],
							} )
						}
					/>
					{ axis === 'y' && (
						<TextControl
							label={ __( 'Height', 'core-carousel' ) }
							value={ height }
							onChange={ ( value ) => setAttributes( { height: value } ) }
							help={ __(
								'Set a fixed height for vertical carousel (e.g., 400px).',
								'core-carousel',
							) }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Autoplay Options', 'core-carousel' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Autoplay', 'core-carousel' ) }
						checked={ autoplay }
						onChange={ ( value ) => setAttributes( { autoplay: value } ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Delay (ms)', 'core-carousel' ) }
								value={ autoplayDelay }
								onChange={ ( value ) =>
									setAttributes( { autoplayDelay: value ?? 1000 } )
								}
								min={ 1000 }
								max={ 10000 }
								step={ 100 }
							/>
							<ToggleControl
								label={ __( 'Stop on Interaction', 'core-carousel' ) }
								checked={ autoplayStopOnInteraction }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnInteraction: value } )
								}
								help={ __(
									'Stop autoplay when user interacts with carousel.',
									'core-carousel',
								) }
							/>
							<ToggleControl
								label={ __( 'Stop on Mouse Enter', 'core-carousel' ) }
								checked={ autoplayStopOnMouseEnter }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnMouseEnter: value } )
								}
								help={ __(
									'Stop autoplay when mouse hovers over carousel.',
									'core-carousel',
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'ARIA Label', 'core-carousel' ) }
					value={ ariaLabel }
					onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
					help={ __(
						"Provide a descriptive label for screen readers (e.g., 'Featured Products').",
						'core-carousel',
					) }
				/>
				{ /* FormTokenField does not allow "help" prop */ }
				<BaseControl
					help={
						<>
							{ __(
								'Use this to allow only certain blocks in the slide. If empty, all blocks will be allowed.',
								'core-carousel',
							) }
						</>
					}
				>
					<FormTokenField
						label={ __( 'Allowed Slide Blocks', 'core-carousel' ) }
						value={ allowedSlideBlocks || [] }
						suggestions={ suggestions as string[] }
						maxSuggestions={ 10 }
						onChange={ ( tokens ) =>
							setAttributes( { allowedSlideBlocks: tokens as string[] } )
						}
						__experimentalValidateInput={ ( value: string ) =>
							suggestions.includes( value )
						}
					/>
				</BaseControl>
			</InspectorAdvancedControls>
			<InspectorControls group="styles">
				<PanelBody title={ __( 'Layout', 'core-carousel' ) }>
					<RangeControl
						label={ __( 'Slide Gap (px)', 'core-carousel' ) }
						value={ attributes.slideGap }
						onChange={ ( value ) => setAttributes( { slideGap: value ?? 0 } ) }
						min={ 0 }
						max={ 500 }
						initialPosition={ 0 }
						allowReset
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...innerBlocksProps } />
		</EditorCarouselContext.Provider>
	);
}
