/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module content-compatibility/integrations/codeblock
 */

import { Plugin } from 'ckeditor5/src/core';
import { disallowedAttributesConverter } from '../converters';
import { setViewAttributes } from '../conversionutils.js';

import DataFilter from '../datafilter';

export default class CodeBlockHtmlSupport extends Plugin {
	static get requires() {
		return [ DataFilter ];
	}

	init() {
		if ( !this.editor.plugins.has( 'CodeBlock' ) ) {
			return;
		}

		const dataFilter = this.editor.plugins.get( DataFilter );

		dataFilter.on( 'register:pre', ( evt, definition ) => {
			if ( definition.model !== 'codeBlock' ) {
				return;
			}

			const editor = this.editor;
			const conversion = editor.conversion;

			conversion.for( 'upcast' ).add( disallowedAttributesConverter( definition, dataFilter ) );
			conversion.for( 'upcast' ).add( viewToModelCodeBlockAttributeConverter( dataFilter ) );
			conversion.for( 'downcast' ).add( modelToViewCodeBlockAttributeConverter() );

			evt.stop();
		} );
	}
}

// View-to-model conversion helper preserving allowed attributes on {@link module:code-block/codeblock~CodeBlock Code Block}
// feature model element.
//
// Attributes are preserved as a value of `htmlAttributes` model attribute.
//
// @private
// @param {module:content-compatibility/datafilter~DataFilter} dataFilter
// @returns {Function} Returns a conversion callback.
function viewToModelCodeBlockAttributeConverter( dataFilter ) {
	return dispatcher => {
		dispatcher.on( 'element:code', ( evt, data, conversionApi ) => {
			const viewCodeElement = data.viewItem;
			const viewPreElement = viewCodeElement.parent;

			if ( !viewPreElement || !viewPreElement.is( 'element', 'pre' ) ) {
				return;
			}

			preserveElementAttributes( viewPreElement, 'htmlAttributes' );
			preserveElementAttributes( viewCodeElement, 'htmlContentAttributes' );

			function preserveElementAttributes( viewElement, attributeName ) {
				const viewAttributes = dataFilter.consumeAllowedAttributes( viewElement, conversionApi );

				if ( viewAttributes ) {
					conversionApi.writer.setAttribute( attributeName, viewAttributes, data.modelRange );
				}
			}
		}, { priority: 'low' } );
	};
}

// Model-to-view conversion helper applying attributes from {@link module:code-block/codeblock~CodeBlock Code Block}
// feature model element.
//
// @private
// @returns {Function} Returns a conversion callback.
function modelToViewCodeBlockAttributeConverter() {
	return dispatcher => {
		dispatcher.on( 'attribute:htmlAttributes:codeBlock', ( evt, data, conversionApi ) => {
			if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
				return;
			}

			const viewCodeElement = conversionApi.mapper.toViewElement( data.item );
			const viewPreElement = viewCodeElement.parent;

			setViewAttributes( conversionApi.writer, data.attributeNewValue, viewPreElement );
		} );

		dispatcher.on( 'attribute:htmlContentAttributes:codeBlock', ( evt, data, conversionApi ) => {
			if ( !conversionApi.consumable.consume( data.item, evt.name ) ) {
				return;
			}

			const viewCodeElement = conversionApi.mapper.toViewElement( data.item );

			setViewAttributes( conversionApi.writer, data.attributeNewValue, viewCodeElement );
		} );
	};
}
