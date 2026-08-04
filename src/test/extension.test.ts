import * as assert from 'assert';
import * as vscode from 'vscode';

import { toggleErbCommentLine } from '../commenter';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('toggles ERB-only lines with the existing comment style', () => {
		assert.strictEqual(toggleErbCommentLine('<%= "Hello world!" %>'), '<%# = "Hello world!" %>');
		assert.strictEqual(toggleErbCommentLine('<%# = "Hello world!" %>'), '<%= "Hello world!"%>');
	});

	test('toggles HTML-only lines with the existing HTML comment style', () => {
		assert.strictEqual(toggleErbCommentLine('<p>Test page</p>'), '<!-- <p>Test page</p> -->');
		assert.strictEqual(toggleErbCommentLine('<!-- <p>Test page</p> -->'), '<p>Test page</p>');
	});

	test('keeps indentation while toggling a line', () => {
		assert.strictEqual(toggleErbCommentLine('  <h1>Test</h1>'), '  <!-- <h1>Test</h1> -->');
	});

	test('comments executable ERB inside HTML comments so Rails will not evaluate it', () => {
		const commented = toggleErbCommentLine('<div><%= @user.email %></div>');

		assert.strictEqual(commented, '<!-- <div><%# comment-erb:=:: @user.email %></div> -->');
		assert.strictEqual(toggleErbCommentLine(commented), '<div><%= @user.email %></div>');
	});

	test('comments executable ERB even when text appears before the first tag', () => {
		const commented = toggleErbCommentLine('Hello <%= current_user.name %>');

		assert.strictEqual(commented, '<!-- Hello <%# comment-erb:=:: current_user.name %> -->');
		assert.strictEqual(toggleErbCommentLine(commented), 'Hello <%= current_user.name %>');
	});

	test('comments every executable ERB tag on a mixed line', () => {
		const commented = toggleErbCommentLine('<span><%= first_name %> <%= last_name %></span>');

		assert.strictEqual(
			commented,
			'<!-- <span><%# comment-erb:=:: first_name %> <%# comment-erb:=:: last_name %></span> -->'
		);
		assert.strictEqual(toggleErbCommentLine(commented), '<span><%= first_name %> <%= last_name %></span>');
	});

	test('preserves existing ERB comments inside mixed HTML and ERB lines', () => {
		const line = '<div><%# existing note %><%= @user.email %></div>';
		const commented = toggleErbCommentLine(line);

		assert.strictEqual(commented, '<!-- <div><%# existing note %><%# comment-erb:=:: @user.email %></div> -->');
		assert.strictEqual(toggleErbCommentLine(commented), line);
	});

	test('does not treat ERB comment text inside a string as an already-commented ERB tag', () => {
		assert.strictEqual(toggleErbCommentLine('<%= "<%# not a tag opener" %>'), '<%# = "<%# not a tag opener" %>');
	});
});
