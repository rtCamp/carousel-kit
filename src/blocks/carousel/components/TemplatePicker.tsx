/**
 * TemplatePicker — grid of slide template options shown during block setup.
 *
 * @package
 */

import { __ } from '@wordpress/i18n';
import { Button, Icon } from '@wordpress/components';
import type { SlideTemplate } from '../templates';

interface TemplatePickerProps {
	templates: SlideTemplate[];
	onSelect: ( template: SlideTemplate ) => void;
	onBack: () => void;
}

export default function TemplatePicker( {
	templates,
	onSelect,
	onBack,
}: TemplatePickerProps ) {
	return (
		<div className="carousel-kit-template-picker">
			<div className="carousel-kit-template-picker__grid">
				{ templates.map( ( template ) => (
					<button
						key={ template.name }
						type="button"
						className="carousel-kit-template-picker__item"
						onClick={ () => onSelect( template ) }
					>
						<div className="carousel-kit-template-picker__icon">
							<Icon icon={ template.icon } size={ 28 } />
						</div>
						<div className="carousel-kit-template-picker__label">
							{ template.label }
						</div>
						<div className="carousel-kit-template-picker__description">
							{ template.description }
						</div>
					</button>
				) ) }
			</div>
			<Button
				variant="link"
				className="carousel-kit-template-picker__back"
				onClick={ onBack }
			>
				{ __( 'Back', 'carousel-kit' ) }
			</Button>
		</div>
	);
}
