/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/* globals ClassicEditor, window, document, console */

ClassicEditor
	.create( document.querySelector( '#snippet-nested-block-quote' ) )
	.then( editor => {
		window.editor2 = editor;
	} )
	.catch( err => {
		console.error( err.stack );
	} );
