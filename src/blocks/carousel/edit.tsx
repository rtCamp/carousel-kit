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
import { useState, useMemo, useCallback, useEffect, useRef } from '@wordpress/element';
import { createBlock, type BlockConfiguration } from '@wordpress/blocks';
import type { CarouselAttributes } from './types';
import { EditorCarouselContext } from './editor-context';
import type { EmblaCarouselType } from 'embla-carousel';
import { getSlideTemplates, type SlideTemplate } from './templates';
import TemplatePicker from './components/TemplatePicker';

type SetupStep = 'slide-count' | 'template';

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
	const [ setupStep, setSetupStep ] = useState<SetupStep>( 'slide-count' );
	const [ pendingSlideCount, setPendingSlideCount ] = useState<number>( 0 );

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
			return innerBlocks.find( ( b ) => b.name === 'carousel-kit/carousel-viewport' )?.clientId;
		},
		[ clientId ],
	);

	const addSlide = useCallback( () => {
		if ( ! viewportClientId ) {
			return;
		}
		insertBlock( createBlock( 'carousel-kit/carousel-slide' ), undefined, viewportClientId );
	}, [ insertBlock, viewportClientId ] );

	const showSetup = ! hasInnerBlocks;
	const prevShowSetup = useRef( showSetup );

	// After setup completes (showSetup transitions from true to false),
	// focus the carousel block so focus stays in the canvas.
	// Supports both iframed and non-iframed editors.
	useEffect( () => {
		if ( prevShowSetup.current && ! showSetup ) {
			const iframe = document.querySelector< HTMLIFrameElement >( 'iframe[name="editor-canvas"]' );
			const blockNode =
				iframe?.contentDocument?.getElementById( `block-${ clientId }` ) ??
				document.getElementById( `block-${ clientId }` );
			blockNode?.focus();
		}
		prevShowSetup.current = showSetup;
	}, [ showSetup, clientId ] );

	// Fetch registered block types for the allowed-blocks token field
	const blockTypes = useSelect( ( select ) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		return ( select( 'core/blocks' ) as any ).getBlockTypes() as BlockConfiguration[];
	}, [] );

	const suggestions = blockTypes?.map( ( block ) => block.name ) || [];

	const blockProps = useBlockProps( {
		className: 'carousel-kit',
		dir: direction,
		'data-axis': axis,
		'data-loop': loop ? 'true' : undefined,
		style: {
			'--carousel-kit-gap': `${ attributes.slideGap }px`,
			'--carousel-kit-height': axis === 'y' ? height : undefined,
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
				createBlock( 'carousel-kit/carousel-controls', {} ),
				createBlock( 'carousel-kit/carousel-dots', {} ),
			],
		);

	/**
	 * Handle the initial setup of the carousel block
	 *
	 * @param {number} count - The number of slides selected by the user.
	 */
	const handleSlideCountPicked = ( count: number ) => {
		setPendingSlideCount( count );
		setSetupStep( 'template' );
	};

	/**
	 * Handle the selection of a slide template during setup.
	 *
	 * @param {SlideTemplate} template - The slide template selected by the user.
	 */
	const handleTemplateSelected = ( template: SlideTemplate ) => {
		// Query Loop goes directly inside the viewport; regular templates get slide wrappers.
		const viewportChildren = template.isQueryLoop
			? [ createBlock( 'core/query', {}, [] ) ]
			: Array.from( { length: Math.max( pendingSlideCount, 1 ) }, () =>
				createBlock( 'carousel-kit/carousel-slide', {}, template.innerBlocks() ),
			);

		replaceInnerBlocks(
			clientId,
			[
				createBlock( 'carousel-kit/carousel-viewport', {}, viewportChildren ),
				createNavGroup(),
			],
			false,
		);
	};

	/**
	 * Skip — still creates the correct structure, just without slides.
	 */
	const handleSkip = () => {
		replaceInnerBlocks(
			clientId,
			[ createBlock( 'carousel-kit/carousel-viewport', {} ), createNavGroup() ],
			false,
		);
	};

	const inspectorControls = (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Carousel Settings', 'carousel-kit' ) }>
					<ToggleControl
						label={ __( 'Loop', 'carousel-kit' ) }
						checked={ loop }
						onChange={ ( value ) => setAttributes( { loop: value } ) }
						help={ __(
							'Enables infinite scrolling of slides.',
							'carousel-kit',
						) }
					/>
					<ToggleControl
						label={ __( 'Free Drag', 'carousel-kit' ) }
						checked={ dragFree }
						onChange={ ( value ) => setAttributes( { dragFree: value } ) }
						help={ __( 'Enables momentum scrolling.', 'carousel-kit' ) }
					/>
					<SelectControl
						label={ __( 'Alignment', 'carousel-kit' ) }
						value={ carouselAlign }
						options={ [
							{ label: __( 'Start', 'carousel-kit' ), value: 'start' },
							{ label: __( 'Center', 'carousel-kit' ), value: 'center' },
							{ label: __( 'End', 'carousel-kit' ), value: 'end' },
						] }
						onChange={ ( value ) =>
							setAttributes( { carouselAlign: value as CarouselAttributes[ 'carouselAlign' ] } )
						}
					/>
					<SelectControl
						label={ __( 'Contain Scroll', 'carousel-kit' ) }
						value={ containScroll }
						options={ [
							{ label: __( 'Trim Snaps', 'carousel-kit' ), value: 'trimSnaps' },
							{ label: __( 'Keep Snaps', 'carousel-kit' ), value: 'keepSnaps' },
							{ label: __( 'None', 'carousel-kit' ), value: '' },
						] }
						onChange={ ( value ) =>
							setAttributes( { containScroll: value as CarouselAttributes[ 'containScroll' ] } )
						}
						help={ __(
							'Prevents excess scrolling at the beginning or end.',
							'carousel-kit',
						) }
					/>
					<ToggleControl
						label={ __( 'Scroll Auto', 'carousel-kit' ) }
						checked={ slidesToScroll === 'auto' }
						onChange={ ( isAuto ) =>
							setAttributes( { slidesToScroll: isAuto ? 'auto' : '1' } )
						}
						help={ __(
							'Scrolls the number of slides currently visible in the viewport.',
							'carousel-kit',
						) }
					/>
					{ slidesToScroll !== 'auto' && (
						<RangeControl
							label={ __( 'Slides to Scroll', 'carousel-kit' ) }
							value={ parseInt( slidesToScroll, 10 ) || 1 }
							onChange={ ( value ) =>
								setAttributes( { slidesToScroll: ( value || 1 ).toString() } )
							}
							min={ 1 }
							max={ 10 }
						/>
					) }
					<SelectControl
						label={ __( 'Direction', 'carousel-kit' ) }
						value={ direction }
						options={ [
							{ label: __( 'Left to Right (LTR)', 'carousel-kit' ), value: 'ltr' },
							{ label: __( 'Right to Left (RTL)', 'carousel-kit' ), value: 'rtl' },
						] }
						onChange={ ( value ) =>
							setAttributes( { direction: value as CarouselAttributes[ 'direction' ] } )
						}
						help={ __(
							'Choose content direction. RTL is typically used for Arabic, Hebrew, and other right-to-left languages.',
							'carousel-kit',
						) }
					/>
					<SelectControl
						label={ __( 'Orientation', 'carousel-kit' ) }
						value={ axis }
						options={ [
							{ label: __( 'Horizontal', 'carousel-kit' ), value: 'x' },
							{ label: __( 'Vertical', 'carousel-kit' ), value: 'y' },
						] }
						onChange={ ( value ) =>
							setAttributes( { axis: value as CarouselAttributes[ 'axis' ] } )
						}
					/>
					{ axis === 'y' && (
						<TextControl
							label={ __( 'Height', 'carousel-kit' ) }
							value={ height }
							onChange={ ( value ) => setAttributes( { height: value } ) }
							help={ __(
								'Set a fixed height for vertical carousel (e.g., 400px).',
								'carousel-kit',
							) }
						/>
					) }
				</PanelBody>
				<PanelBody
					title={ __( 'Autoplay Options', 'carousel-kit' ) }
					initialOpen={ false }
				>
					<ToggleControl
						label={ __( 'Enable Autoplay', 'carousel-kit' ) }
						checked={ autoplay }
						onChange={ ( value ) => setAttributes( { autoplay: value } ) }
					/>
					{ autoplay && (
						<>
							<RangeControl
								label={ __( 'Delay (ms)', 'carousel-kit' ) }
								value={ autoplayDelay }
								onChange={ ( value ) =>
									setAttributes( { autoplayDelay: value ?? 1000 } )
								}
								min={ 1000 }
								max={ 10000 }
								step={ 100 }
							/>
							<ToggleControl
								label={ __( 'Stop on Interaction', 'carousel-kit' ) }
								checked={ autoplayStopOnInteraction }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnInteraction: value } )
								}
								help={ __(
									'Stop autoplay when user interacts with carousel.',
									'carousel-kit',
								) }
							/>
							<ToggleControl
								label={ __( 'Stop on Mouse Enter', 'carousel-kit' ) }
								checked={ autoplayStopOnMouseEnter }
								onChange={ ( value ) =>
									setAttributes( { autoplayStopOnMouseEnter: value } )
								}
								help={ __(
									'Stop autoplay when mouse hovers over carousel.',
									'carousel-kit',
								) }
							/>
						</>
					) }
				</PanelBody>
			</InspectorControls>
			<InspectorAdvancedControls>
				<TextControl
					label={ __( 'ARIA Label', 'carousel-kit' ) }
					value={ ariaLabel }
					onChange={ ( value ) => setAttributes( { ariaLabel: value } ) }
					help={ __(
						"Provide a descriptive label for screen readers (e.g., 'Featured Products').",
						'carousel-kit',
					) }
				/>
				{ /* FormTokenField does not allow "help" prop */ }
				<BaseControl
					help={
						<>
							{ __(
								'Use this to allow only certain blocks in the slide. If empty, all blocks will be allowed.',
								'carousel-kit',
							) }
						</>
					}
				>
					<FormTokenField
						label={ __( 'Allowed Slide Blocks', 'carousel-kit' ) }
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
				<PanelBody title={ __( 'Layout', 'carousel-kit' ) }>
					<RangeControl
						label={ __( 'Slide Gap (px)', 'carousel-kit' ) }
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
						label={ __( 'Carousel', 'carousel-kit' ) }
						instructions={
							setupStep === 'slide-count'
								? __( 'How many slides would you like to start with?', 'carousel-kit' )
								: __( 'Choose a slide template:', 'carousel-kit' )
						}
						className="carousel-kit-setup"
					>
						{ setupStep === 'slide-count' && (
							<>
								<div className="carousel-kit-setup__options">
									{ [ 1, 2, 3, 4 ].map( ( count ) => (
										<Button
											key={ count }
											variant="secondary"
											className="carousel-kit-setup__option"
											onClick={ () => handleSlideCountPicked( count ) }
										>
											{ count === 1
												? __( '1 Slide', 'carousel-kit' )
												: `${ count } ${ __( 'Slides', 'carousel-kit' ) }` }
										</Button>
									) ) }
								</div>
								<Button
									variant="link"
									className="carousel-kit-setup__skip"
									onClick={ handleSkip }
								>
									{ __( 'Skip', 'carousel-kit' ) }
								</Button>
							</>
						) }
						{ setupStep === 'template' && (
							<TemplatePicker
								templates={ getSlideTemplates() }
								onSelect={ handleTemplateSelected }
								onBack={ () => setSetupStep( 'slide-count' ) }
							/>
						) }
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
					label={ __( 'Add Slide', 'carousel-kit' ) }
					onClick={ addSlide }
				/>
			</BlockControls>
			{ inspectorControls }
			<div { ...innerBlocksProps } />
		</EditorCarouselContext.Provider>
	);
}
