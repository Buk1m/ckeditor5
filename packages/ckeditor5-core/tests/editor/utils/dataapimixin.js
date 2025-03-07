/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

import DataApiMixin from '../../../src/editor/utils/dataapimixin.js';
import Editor from '../../../src/editor/editor.js';

describe( 'DataApiMixin', () => {
	it( 'it returns the passed parameter for compatibility reasons', async () => {
		class CustomEditor extends Editor {}

		const editor = new CustomEditor();

		expect( DataApiMixin( editor ) ).to.equal( editor );

		editor.fire( 'ready' );
		await editor.destroy();
	} );
} );
