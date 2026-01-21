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
	[ 'carousel-system/carousel-viewport', {} ],
	[ 'carousel-system/carousel-controls', {} ],
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
		className: 'rt-carousel',
		dir: direction,
		'data-axis': axis,
		style: {
			'--rt-carousel-gap': `${ attributes.slideGap }px`,
			'--rt-carousel-height': axis === 'y' ? height : undefined,
		} as React.CSSProperties,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		template: TEMPLATE,
	} );

	// Memoize carouselOptions separately to prevent excessive viewport reinitializations
	const carouselOptions = useMemo(
		() => ( { loop, dragFree, align: carouselAlign, containScroll, direction, axis, height } ),
		[ loop, dragFree, carouselAlign, containScroll, direction, axis, height ]
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
				<PanelBody title={ __( 'Carousel Settings', 'carousel-system-interactivity-api' ) }>
					<ToggleControl
						label={ __( 'Loop', 'carousel-system-interactivity-api' ) }
						checked={ loop }
						onChange={ ( value ) => setAttributes( { loop: value } ) }
						help={ __(
							'Infinite scrolling of slides (Frontend only). Disabled in editor for stability.',
							'carousel-system-interactivity-api',
						) }
					/>
					<ToggleControl
						label={ __( 'Free Drag', 'carousel-system-interactivity-api' ) }
						checked={ dragFree }
						onChange={ ( value ) => setAttributes( { dragFree: value } ) }
						help={ __( 'Enables momentum scrolling.', 'carousel-system-interactivity-api' ) }
					/>
					<SelectControl
						label={ __( 'Alignment', 'carousel-system-interactivity-api' ) }
						value={ carouselAlign }
						options={ [
							{ label: __( 'Start', 'carousel-system-interactivity-api' ), value: 'start' },
							{ label: __( 'Center', 'carousel-system-interactivity-api' ), value: 'center' },
							{ label: __( 'End', 'carousel-system-interactivity-api' ), value: 'end' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								carouselAlign: value as CarouselAttributes['carouselAlign'],
							} )
						}
					/>
					<SelectControl
						label={ __( 'Contain Scroll', 'carousel-system-interactivity-api' ) }
						value={ containScroll }
						options={ [
							{ label: __( 'Trim Snaps', 'carousel-system-interactivity-api' ), value: 'trimSnaps' },
							{ label: __( 'Keep Snaps', 'carousel-system-interactivity-api' ), value: 'keepSnaps' },
							{ label: __( 'None', 'carousel-system-interactivity-api' ), value: '' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								containScroll: value as CarouselAttributes['containScroll'],
							} )
						}
						help={ __(
							'Prevents excess scrolling at the beginning or end.',
							'carousel-system-interactivity-api',
						) }
					/>
					<SelectControl
						label={ __( 'Direction', 'carousel-system-interactivity-api' ) }
						value={ direction }
						options={ [
							{ label: __( 'Left to Right (LTR)', 'carousel-system-interactivity-api' ), value: 'ltr' },
							{ label: __( 'Right to Left (RTL)', 'carousel-system-interactivity-api' ), value: 'rtl' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								direction: value as CarouselAttributes['direction'],
							} )
						}
						help={ __(
							'Choose content direction. RTL is typically used for Arabic, Hebrew, and other right-to-left languages.',
							'carousel-system-interactivity-api',
						) }
					/>
					<SelectControl
						label={ __( 'Orientation', 'carousel-system-interactivity-api' ) }
						value={ axis }
						options={ [
							{ label: __( 'Horizontal', 'carousel-system-interactivity-api' ), value: 'x' },
							{ label: __( 'Vertical', 'carousel-system-interactivity-api' ), value: 'y' },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								axis: value as CarouselAttributes['axis'],
							} )
						}
					/>
					{ axis === 'y' && (
						<TextControl
							label={ __( 'Height', 'carousel-system-interactivity-api' ) }
							value={ height }
							onChange={ ( value ) => setAttributes( { height: value } ) }
							help={ __(
								'Set a fixed height for vertical carousel (e.g., 400px).',
								'carousel-system-interactivity-api',
							) }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Autoplay Options', 'carousel-system-interactivity-api' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Autoplay', 'carousel-system-interactivity-api' ) }
						checked={ autoplay }
						onChange={ ( value ) => setAttributes( { autoplay: value } ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Delay (ms)', 'carousel-system-interactivity-api' ) }
								value={ autoplayDelay }
								onChange={ ( value ) =>
									setAttributes( { autoplayDelay: value ?? 1000 } )
								}
								min={ 1000 }
								max={ 10000 }
								step={ 100 }
							/>
							<ToggleControl
								label={ __( 'Stop on Interaction', 'carousel-system-interactivity-api' ) }
								checked={ autoplayStopOnInteraction }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnInteraction: value } )
								}
								help={ __(
									'Stop autoplay when user interacts with carousel.',
									'carousel-system-interactivity-api',
								) }
							/>
							<ToggleControl
								label={ __( 'Stop on Mouse Enter', 'carousel-system-interactivity-api' ) }
								checked={ autoplayStopOnMouseEnter }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnMouseEnter: value } )
								}
								help={ __(
									'Stop autoplay when mouse hovers over carousel.',
									'carousel-system-interactivity-api',
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'ARIA Label', 'carousel-system-interactivity-api' ) }
					value={ ariaLabel }
					onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
					help={ __(
						"Provide a descriptive label for screen readers (e.g., 'Featured Products').",
						'carousel-system-interactivity-api',
					) }
				/>
				{ /* FormTokenField does not allow "help" prop */ }
				<BaseControl
					help={
						<>
							{ __(
								'Use this to allow only certain blocks in the slide. If empty, all blocks will be allowed.',
								'carousel-system-interactivity-api',
							) }
						</>
					}
				>
					<FormTokenField
						label={ __( 'Allowed Slide Blocks', 'carousel-system-interactivity-api' ) }
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
				<PanelBody title={ __( 'Layout', 'carousel-system-interactivity-api' ) }>
					<RangeControl
						label={ __( 'Slide Gap (px)', 'carousel-system-interactivity-api' ) }
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
