/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-licensing-options
 */

/* eslint-env node */

module.exports = {
	name: 'preset-default',
	plugins: [
		{
			name: 'removeViewBox',
			active: false
		},
		{ name: 'collapseGroups' },
		{ name: 'removeDimensions' },
		{
			name: 'removeAttrs',
			params: {
				attrs: '(fill|stroke|fill-rule)'
			}
		},
		{
			name: 'convertPathData',
			params: {
				noSpaceAfterFlags: false
			}
		},
		{ name: 'removeTitle' },
		{ name: 'removeComments' },
		{ name: 'removeMetadata' }
	]
};
