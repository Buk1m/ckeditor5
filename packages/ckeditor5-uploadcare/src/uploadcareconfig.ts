/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module uploadcare/uploadcareconfig
 */

/**
 * The configuration of the {@link module:uploadcare/uploadcare~Uploadcare Uploadcare feature}.
 *
 * The minimal configuration for the Uploadcare feature requires providing the
 * {@link module:uploadcare/uploadcareconfig~UploadcareConfig#tokenUrl `config.uploadcare.tokenUrl`}:
 *
 * ```ts
 * ClassicEditor
 * 	.create( editorElement, {
 * 		uploadcare: {
 * 			tokenUrl: 'https://example.com/cs-token-endpoint'
 * 		}
 * 	} )
 * 	.then( ... )
 * 	.catch( ... );
 * ```
 *
 * Hovewer, you can also adjust the feature to fit your needs:
 *
 * ```ts
 * ClassicEditor
 * 	.create( editorElement, {
 * 		uploadcare: {
 * 			sourceList: [
 * 				'local',
 * 				'link',
 * 				'instagram',
 * 				'gdrive'
 * 			],
 * 			tokenUrl: 'https://example.com/cs-token-endpoint'
 * 		}
 * 	} )
 * 	.then( ... )
 * 	.catch( ... );
 * ```
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 */
export interface UploadcareConfig {

	/**
	 * The authentication token URL for Uploadcare feature.
	 */
	tokenUrl?: string;

	/**
	 * The theme for CKBox dialog.
	 */
	sourceList?: Array<UploadcareSource>;
}

/**
 * Definition of all available upload sources.
 */
export enum UploadcareSource {
	Local = 'local',
	URL = 'url',
	Dropbox = 'dropbox',
	GDrive = 'gdrive',
	Facebook = 'facebook',
	GPhotos = 'gphotos',
	Instagram = 'instagram',
	OneDrive = 'onedrive'
}

/**
 * Image asset definition.
 *
 * The definition contains the unique `id`, asset `type` and an `attributes` definition.
 */
export interface UploadcareAssetImageDefinition {

	/**
	 * An unique asset id.
	 */
	id: string;

	/**
	 * Asset type.
	 */
	type: 'image';

	/**
	 * Asset attributes.
	 */
	attributes: UploadcareAssetImageAttributesDefinition;
}

/**
 * Asset attributes definition for an image.
 *
 * The definition contains the `imageFallbackUrl`, an `imageSources` array with one image source definition object and the
 * `imageTextAlternative`.
 */
export interface UploadcareAssetImageAttributesDefinition {

	/**
	 * A fallback URL for browsers that do not support the "webp" format.
	 */
	imageFallbackUrl: string;

	/**
	 * Image width.
	 */
	imageWidth?: number;

	/**
	 * Image height.
	 */
	imageHeight?: number;
}
