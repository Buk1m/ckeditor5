/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module emoji/emojimention
 */

import { Database } from 'emoji-picker-element';
import { logWarning, type LocaleTranslate } from 'ckeditor5/src/utils.js';
import { Plugin, type Editor } from 'ckeditor5/src/core.js';
import EmojiPicker from './emojipicker.js';
import type { NativeEmoji } from 'emoji-picker-element/shared.d.ts';

import {
	type MentionFeed,
	type MentionFeedObjectItem
} from '@ckeditor/ckeditor5-mention';

const EMOJI_PREFIX = 'emoji';
const SHOW_ALL_EMOJI = '__SHOW_ALL_EMOJI__';

/**
 * The emoji mention plugin.
 *
 * Introduces the autocomplete of emojis while typing.
 */
export default class EmojiMention extends Plugin {
	private _emojiDropdownLimit: number;
	private _mentionMarker: string;
	private _showAllEmojiId: string;
	private _emojiDatabase: Database;
	declare private _hasEmojiPicker: boolean;

	/**
	 * @inheritDoc
	 */
	public static get requires() {
		return [ 'Mention' ] as const;
	}

	/**
	 * @inheritDoc
	 */
	public static get pluginName() {
		return 'EmojiMention' as const;
	}

	/**
	 * @inheritDoc
	 */
	public static override get isOfficialPlugin(): true {
		return true;
	}

	/**
	 * @inheritDoc
	 */
	constructor( editor: Editor ) {
		super( editor );

		this.editor.config.define( 'emoji', {
			dropdownLimit: 6,
			marker: ':'
		} );

		this._emojiDropdownLimit = editor.config.get( 'emoji.dropdownLimit' )!;
		this._mentionMarker = editor.config.get( 'emoji.marker' )!;

		this._showAllEmojiId = formatEmojiId( SHOW_ALL_EMOJI );
		this._emojiDatabase = new Database();

		const mentionFeedsConfigs = this.editor.config.get( 'mention.feeds' )! as Array<MentionFeed>;
		const markerAlreadyUsed = mentionFeedsConfigs.some( config => config.marker === this._mentionMarker );

		if ( markerAlreadyUsed ) {
			/**
			 * The `marker` in the `emoji` config is already used by other mention plugin configuration.
			 *
			 * @error emoji-config-marker-already-used
			 * @param {string} marker Used marker.
			 */
			logWarning( 'emoji-config-marker-already-used', { marker: this._mentionMarker } );

			return;
		}

		this._setupMentionConfiguration( mentionFeedsConfigs );
		this.editor.once( 'ready', this._overrideMentionExecuteListener.bind( this ) );
	}

	/**
	 * @inheritDoc
	 */
	public init(): void {
		this._hasEmojiPicker = this.editor.plugins.has( EmojiPicker );
	}

	/**
	 * Initializes the configuration for emojis in the mention feature.
	 */
	private _setupMentionConfiguration( mentionFeedsConfigs: Array<MentionFeed> ): void {
		const emojiMentionFeedConfig = {
			marker: this._mentionMarker,
			dropdownLimit: this._emojiDropdownLimit,
			itemRenderer: this._getCustomItemRendererFn( this.editor.t ),
			feed: this._getQueryEmojiFn()
		};

		this.editor.config.set( 'mention.feeds', [ ...mentionFeedsConfigs, emojiMentionFeedConfig ] );
	}

	/**
	 * Returns the `itemRenderer()` callback for mention config.
	 */
	private _getCustomItemRendererFn( t: LocaleTranslate ) {
		return ( item: MentionFeedObjectItem ) => {
			const itemElement = document.createElement( 'span' );

			itemElement.classList.add( 'custom-item' );
			itemElement.id = `mention-list-item-id-${ item.id }`;
			itemElement.style.width = '100%';
			itemElement.style.display = 'block';

			switch ( item.id ) {
				case this._showAllEmojiId:
					itemElement.textContent = t( 'Show all emoji...' );

					break;
				default:
					itemElement.textContent = `${ item.text } ${ removeEmojiPrefix( item.id ) }`;
			}

			return itemElement;
		};
	}

	/**
	 * Overrides the default mention execute listener to insert an emoji as plain text instead.
	 */
	private _overrideMentionExecuteListener() {
		this.editor.commands.get( 'mention' )!.on( 'execute', ( event, data ) => {
			const eventData = data[ 0 ];

			if ( !isEmojiId( eventData.mention.id ) ) {
				return;
			}

			let textToInsert = eventData.mention.text;
			let shouldShowEmojiView;

			if ( eventData.mention.id === this._showAllEmojiId ) {
				shouldShowEmojiView = true;

				textToInsert = '';
			}

			this.editor.model.change( writer => {
				this.editor.model.insertContent( writer.createText( textToInsert ), eventData.range );
			} );

			if ( shouldShowEmojiView ) {
				setTimeout( () => {
					this.editor.plugins.get( EmojiPicker ).showUI( eventData.mention.text );
				} );
			}

			event.stop();
		}, { priority: 'high' } );
	}

	/**
	 * Returns the `feed()` callback for mention config.
	 */
	private _getQueryEmojiFn(): ( searchQuery: string ) => Promise<Array<MentionFeedObjectItem>> {
		return async ( searchQuery: string ) => {
			// `getEmojiBySearchQuery()` returns nothing when querying with a single character.
			if ( searchQuery.length < 2 ) {
				return [];
			}

			const emojis = await this._emojiDatabase.getEmojiBySearchQuery( searchQuery )
				.then( queryResult => {
					return ( queryResult as Array<NativeEmoji> ).map( emoji => {
						const id = emoji.annotation.replace( /[ :]+/g, '_' ).toLocaleLowerCase();

						return {
							id: formatEmojiId( id ),
							text: emoji.unicode
						};
					} );
				} );

			return this._hasEmojiPicker ?
				[ ...emojis.slice( 0, this._emojiDropdownLimit - 1 ), { id: this._showAllEmojiId, text: searchQuery } ] :
				emojis.slice( 0, this._emojiDropdownLimit );
		};
	}
}

function isEmojiId( string: string ): boolean {
	return new RegExp( `^${ EMOJI_PREFIX }:[^:]+:$` ).test( string );
}

function formatEmojiId( id: string ): string {
	return `${ EMOJI_PREFIX }:${ id }:`;
}

function removeEmojiPrefix( formattedEmojiId: string ): string {
	return formattedEmojiId.replace( new RegExp( `^${ EMOJI_PREFIX }:` ), ':' );
}
