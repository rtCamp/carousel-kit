import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InspectorAdvancedControls,
	BlockControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	FormTokenField,
	BaseControl,
	TextControl,
	RangeControl,
	Placeholder,
	Button,
	ToolbarButton,
} from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { useSelect, useDispatch } from '@wordpress/data';
import { useState, useMemo, useCallback, useEffect } from '@wordpress/element';
import { createBlock, type BlockConfiguration } from '@wordpress/blocks';
import type { CarouselAttributes } from './types';
import { EditorCarouselContext } from './editor-context';
import type { EmblaCarouselType } from 'embla-carousel';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
}: {
	attributes: CarouselAttributes;
	setAttributes: ( attrs: Partial<CarouselAttributes> ) => void;
	clientId: string;
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
	const [ scrollProgress, setScrollProgress ] = useState( 0 );
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );
	const [ slideCount, setSlideCount ] = useState( 0 );

	const { replaceInnerBlocks, insertBlock } = useDispatch( 'core/block-editor' );

	const hasInnerBlocks = useSelect(
		( select ) =>
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			( select( 'core/block-editor' ) as any ).getBlockCount( clientId ) > 0,
		[ clientId ],
	);

	const viewportClientId = useSelect(
		( select ) => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const innerBlocks = ( select( 'core/block-editor' ) as any ).getBlocks( clientId ) as Array<{ name: string; clientId: string }>;
			return innerBlocks.find( ( b ) => b.name === 'rt-carousel/carousel-viewport' )?.clientId;
		},
		[ clientId ],
	);

	const addSlide = useCallback( () => {
		if ( ! viewportClientId ) {
			return;
		}
		insertBlock( createBlock( 'rt-carousel/carousel-slide' ), undefined, viewportClientId );
	}, [ insertBlock, viewportClientId ] );

	const showSetup = ! hasInnerBlocks;

	// Fetch registered block types for the allowed-blocks token field
	const blockTypes = useSelect( ( select ) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ( select( 'core/blocks' ) as any ).getBlockTypes() as BlockConfiguration[];
	}, [] );

	const suggestions = blockTypes?.map( ( block ) => block.name ) || [];

	const blockProps = useBlockProps( {
		className: 'rt-carousel',
		dir: direction,
		'data-axis': axis,
		'data-loop': loop ? 'true' : undefined,
		style: {
			'--rt-carousel-gap': `${ attributes.slideGap }px`,
			'--rt-carousel-height': axis === 'y' ? height : undefined,
		} as React.CSSProperties,
	} );

	const innerBlocksProps = useInnerBlocksProps( blockProps, {} );

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

	const contextValue = useMemo(
		() => ( {
			emblaApi,
			setEmblaApi,
			canScrollPrev,
			setCanScrollPrev,
			canScrollNext,
			setCanScrollNext,
			scrollProgress,
			setScrollProgress,
			selectedIndex,
			slideCount,
			carouselOptions,
		} ),
		[
			emblaApi,
			canScrollPrev,
			canScrollNext,
			scrollProgress,
			selectedIndex,
			slideCount,
			carouselOptions,
			setEmblaApi,
			setCanScrollPrev,
			setCanScrollNext,
			setScrollProgress,
		],
	);

	// Subscribe to Embla events to update scrollProgress, selectedIndex, and slideCount
	useEffect( () => {
		if ( ! emblaApi ) {
			return;
		}

		const updateScrollProgress = () => {
			setScrollProgress( emblaApi.scrollProgress() );
		};

		const updateState = () => {
			setSelectedIndex( emblaApi.selectedScrollSnap() );
			setSlideCount( emblaApi.slideNodes().length );
			updateScrollProgress();
		};

		emblaApi
			.on( 'scroll', updateScrollProgress )
			.on( 'select', updateState )
			.on( 'reInit', updateState );

		updateState();

		return () => {
			emblaApi
				.off( 'scroll', updateScrollProgress )
				.off( 'select', updateState )
				.off( 'reInit', updateState );
		};
	}, [ emblaApi ] );

	const createNavGroup = () =>
		createBlock(
			'core/group',
			{
				layout: {
					type: 'flex',
					flexWrap: 'nowrap',
					justifyContent: 'space-between',
				},
			},
			[
				createBlock( 'rt-carousel/carousel-controls', {} ),
				createBlock( 'rt-carousel/carousel-dots', {} ),
			],
		);

	const handleSetup = ( initialSlideCount: number ) => {
		const slides = Array.from( { length: initialSlideCount }, () =>
			createBlock( 'rt-carousel/carousel-slide', {}, [
				createBlock( 'core/paragraph', {} ),
			] ),
		);

		replaceInnerBlocks(
			clientId,
			[ createBlock( 'rt-carousel/carousel-viewport', {}, slides ), createNavGroup() ],
			false,
		);
	};

	/**
	 * Skip — still creates the correct structure, just without slides.
	 */
	const handleSkip = () => {
		replaceInnerBlocks(
			clientId,
			[ createBlock( 'rt-carousel/carousel-viewport', {} ), createNavGroup() ],
			false,
		);
	};

	const inspectorControls = (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Carousel Settings', 'rt-carousel' ) }>
					<ToggleControl
						label={ __( 'Loop', 'rt-carousel' ) }
						checked={ loop }
						onChange={ ( value ) => setAttributes( { loop: value } ) }
						help={ __(
							'Enables infinite scrolling of slides.',
							'rt-carousel',
						) }
					/>
					<ToggleControl
						label={ __( 'Free Drag', 'rt-carousel' ) }
						checked={ dragFree }
						onChange={ ( value ) => setAttributes( { dragFree: value } ) }
						help={ __( 'Enables momentum scrolling.', 'rt-carousel' ) }
					/>
					<SelectControl
						label={ __( 'Alignment', 'rt-carousel' ) }
						value={ carouselAlign }
						options={ [
							{ label: __( 'Start', 'rt-carousel' ), value: 'start' },
							{ label: __( 'Center', 'rt-carousel' ), value: 'center' },
							{ label: __( 'End', 'rt-carousel' ), value: 'end' },
						] }
						onChange={ ( value ) =>
							setAttributes( { carouselAlign: value as CarouselAttributes[ 'carouselAlign' ] } )
						}
					/>
					<SelectControl
						label={ __( 'Contain Scroll', 'rt-carousel' ) }
						value={ containScroll }
						options={ [
							{ label: __( 'Trim Snaps', 'rt-carousel' ), value: 'trimSnaps' },
							{ label: __( 'Keep Snaps', 'rt-carousel' ), value: 'keepSnaps' },
							{ label: __( 'None', 'rt-carousel' ), value: '' },
						] }
						onChange={ ( value ) =>
							setAttributes( { containScroll: value as CarouselAttributes[ 'containScroll' ] } )
						}
						help={ __(
							'Prevents excess scrolling at the beginning or end.',
							'rt-carousel',
						) }
					/>
					<ToggleControl
						label={ __( 'Scroll Auto', 'rt-carousel' ) }
						checked={ slidesToScroll === 'auto' }
						onChange={ ( isAuto ) =>
							setAttributes( { slidesToScroll: isAuto ? 'auto' : '1' } )
						}
						help={ __(
							'Scrolls the number of slides currently visible in the viewport.',
							'rt-carousel',
						) }
					/>
					{ slidesToScroll !== 'auto' && (
						<RangeControl
							label={ __( 'Slides to Scroll', 'rt-carousel' ) }
							value={ parseInt( slidesToScroll, 10 ) || 1 }
							onChange={ ( value ) =>
								setAttributes( { slidesToScroll: ( value || 1 ).toString() } )
							}
							min={ 1 }
							max={ 10 }
						/>
					) }
					<SelectControl
						label={ __( 'Direction', 'rt-carousel' ) }
						value={ direction }
						options={ [
							{ label: __( 'Left to Right (LTR)', 'rt-carousel' ), value: 'ltr' },
							{ label: __( 'Right to Left (RTL)', 'rt-carousel' ), value: 'rtl' },
						] }
						onChange={ ( value ) =>
							setAttributes( { direction: value as CarouselAttributes[ 'direction' ] } )
						}
						help={ __(
							'Choose content direction. RTL is typically used for Arabic, Hebrew, and other right-to-left languages.',
							'rt-carousel',
						) }
					/>
					<SelectControl
						label={ __( 'Orientation', 'rt-carousel' ) }
						value={ axis }
						options={ [
							{ label: __( 'Horizontal', 'rt-carousel' ), value: 'x' },
							{ label: __( 'Vertical', 'rt-carousel' ), value: 'y' },
						] }
						onChange={ ( value ) =>
							setAttributes( { axis: value as CarouselAttributes[ 'axis' ] } )
						}
					/>
					{ axis === 'y' && (
						<TextControl
							label={ __( 'Height', 'rt-carousel' ) }
							value={ height }
							onChange={ ( value ) => setAttributes( { height: value } ) }
							help={ __(
								'Set a fixed height for vertical carousel (e.g., 400px).',
								'rt-carousel',
							) }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Autoplay Options', 'rt-carousel' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Autoplay', 'rt-carousel' ) }
						checked={ autoplay }
						onChange={ ( value ) => setAttributes( { autoplay: value } ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Delay (ms)', 'rt-carousel' ) }
								value={ autoplayDelay }
								onChange={ ( value ) =>
									setAttributes( { autoplayDelay: value ?? 1000 } )
								}
								min={ 1000 }
								max={ 10000 }
								step={ 100 }
							/>
							<ToggleControl
								label={ __( 'Stop on Interaction', 'rt-carousel' ) }
								checked={ autoplayStopOnInteraction }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnInteraction: value } )
								}
								help={ __(
									'Stop autoplay when user interacts with carousel.',
									'rt-carousel',
								) }
							/>
							<ToggleControl
								label={ __( 'Stop on Mouse Enter', 'rt-carousel' ) }
								checked={ autoplayStopOnMouseEnter }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnMouseEnter: value } )
								}
								help={ __(
									'Stop autoplay when mouse hovers over carousel.',
									'rt-carousel',
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'ARIA Label', 'rt-carousel' ) }
					value={ ariaLabel }
					onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
					help={ __(
						"Provide a descriptive label for screen readers (e.g., 'Featured Products').",
						'rt-carousel',
					) }
				/>
				{ /* FormTokenField does not allow "help" prop */ }
				<BaseControl
					help={
						<>
							{ __(
								'Use this to allow only certain blocks in the slide. If empty, all blocks will be allowed.',
								'rt-carousel',
							) }
						</>
					}
				>
					<FormTokenField
						label={ __( 'Allowed Slide Blocks', 'rt-carousel' ) }
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
				<PanelBody title={ __( 'Layout', 'rt-carousel' ) }>
					<RangeControl
						label={ __( 'Slide Gap (px)', 'rt-carousel' ) }
						value={ attributes.slideGap }
						onChange={ ( value ) => setAttributes( { slideGap: value ?? 0 } ) }
						min={ 0 }
						max={ 500 }
						initialPosition={ 0 }
						allowReset
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);

	if ( showSetup ) {
		return (
			<EditorCarouselContext.Provider value={ contextValue }>
				{ inspectorControls }
				<div { ...blockProps }>
					<Placeholder
						icon="columns"
						label={ __( 'Carousel', 'rt-carousel' ) }
						instructions={ __( 'How many slides would you like to start with?', 'rt-carousel' ) }
						className="rt-carousel-setup"
					>
						<div className="rt-carousel-setup__options">
							{ [ 1, 2, 3, 4 ].map( ( count ) => (
								<Button
									key={ count }
									variant="secondary"
									className="rt-carousel-setup__option"
									onClick={ () => handleSetup( count ) }
								>
									{ count === 1
										? __( '1 Slide', 'rt-carousel' )
										: `${ count } ${ __( 'Slides', 'rt-carousel' ) }` }
								</Button>
							) ) }
						</div>
						<Button
							variant="link"
							className="rt-carousel-setup__skip"
							onClick={ handleSkip }
						>
							{ __( 'Skip', 'rt-carousel' ) }
						</Button>
					</Placeholder>
				</div>
			</EditorCarouselContext.Provider>
		);
	}

	return (
		<EditorCarouselContext.Provider value={ contextValue }>
			<BlockControls>
				<ToolbarButton
					icon={ plus }
					label={ __( 'Add Slide', 'rt-carousel' ) }
					onClick={ addSlide }
				/>
			</BlockControls>
			{ inspectorControls }
			<div { ...innerBlocksProps } />
		</EditorCarouselContext.Provider>
	);
}
