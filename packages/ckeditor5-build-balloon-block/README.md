CKEditor&nbsp;5 balloon block editor build
==============================================

[![npm version](https://badge.fury.io/js/%40ckeditor%2Fckeditor5-build-balloon-block.svg)](https://www.npmjs.com/package/@ckeditor/ckeditor5-build-balloon-block)
[![Coverage Status](https://coveralls.io/repos/github/ckeditor/ckeditor5/badge.svg?branch=master)](https://coveralls.io/github/ckeditor/ckeditor5?branch=master)
[![CircleCI](https://circleci.com/gh/ckeditor/ckeditor5.svg?style=shield)](https://app.circleci.com/pipelines/github/ckeditor/ckeditor5?branch=master)

The build of CKEditor&nbsp;5 featuring the balloon and block toolbars. Read more about the [balloon block editor build](https://ckeditor.com/docs/ckeditor5/latest/getting-started/legacy/installation-methods/predefined-builds.html#balloon-block-editor) and see the [demo](https://ckeditor.com/docs/ckeditor5/latest/examples/builds/balloon-block-editor.html).

![CKEditor&nbsp;5 balloon block editor build screenshot](https://c.cksource.com/a/1/img/npm/ckeditor5-build-balloon-block.png)

## Documentation

See:

* [Installation](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/quick-start.html) for how to install this package and what it contains.
* [Editor lifecycle](https://ckeditor.com/docs/ckeditor5/latest/installation/legacy/getting-started/editor-lifecycle.html) for how to create an editor and interact with it.
* [Configuration](https://ckeditor.com/docs/ckeditor5/latest/getting-started/setup/configuration.html) for how to configure the editor.
* [Creating custom builds](https://ckeditor.com/docs/ckeditor5/latest/installation/getting-started/quick-start.html#building-the-editor-from-source) for how to customize the build (configure and rebuild the editor bundle).

## Quick start

First, install the build from npm:

```bash
npm install --save @ckeditor/ckeditor5-build-balloon-block
```

And use it in your website:

```html
<div id="editor">
	<p>This is the editor content.</p>
</div>
<script src="./node_modules/@ckeditor/ckeditor5-build-balloon-block/build/ckeditor.js"></script>
<script>
	BalloonEditor
		.create( document.querySelector( '#editor' ) )
		.then( editor => {
			window.editor = editor;
		} )
		.catch( error => {
			console.error( 'There was a problem initializing the editor.', error );
		} );
</script>
```

Or in your JavaScript application:

```js
import BalloonEditor from '@ckeditor/ckeditor5-build-balloon-block';

// Or using the CommonJS version:
// const BalloonEditor = require( '@ckeditor/ckeditor5-build-balloon-block' );

BalloonEditor
	.create( document.querySelector( '#editor' ) )
	.then( editor => {
		window.editor = editor;
	} )
	.catch( error => {
		console.error( 'There was a problem initializing the editor.', error );
	} );
```

**Note:** If you are planning to integrate CKEditor&nbsp;5 deep into your application, it is actually more convenient and recommended to install and import the source modules directly (like it happens in `ckeditor.js`). Read more in the [Advanced setup guide](https://ckeditor.com/docs/ckeditor5/latest/getting-started/legacy/advanced/advanced-setup.html).

**Note:** You can configure the block toolbar items using the [`config.blockToolbar`](https://ckeditor.com/docs/ckeditor5/latest/api/module_core_editor_editorconfig-EditorConfig.html#member-blockToolbar) option.

## License

Licensed under a dual-license model, this software is available under:

* the [GNU General Public License Version 2 or later](https://www.gnu.org/licenses/gpl.html),
* or commercial license terms from CKSource Holding sp. z o.o.

For more information, see: [https://ckeditor.com/legal/ckeditor-licensing-options](https://ckeditor.com/legal/ckeditor-licensing-options).
