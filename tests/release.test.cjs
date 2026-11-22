const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');

test('page loads only local assets and has no inline executable content', () => {
    const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
    assert.doesNotMatch(html, /<style\b|<script(?![^>]*\bsrc=)|\son\w+\s*=|\sstyle\s*=/i);
    for (const match of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        if (/^https:/.test(match[1])) continue;
        assert.ok(fs.statSync(path.join(root, match[1])).isFile());
    }
    assert.doesNotMatch(html, /<(?:img|script)[^>]+src="https?:/i);
});

test('Apache policy denies inline script and network connections', () => {
    const config = fs.readFileSync(path.join(root, '.htaccess'), 'utf8');
    assert.match(config, /script-src 'self'; style-src 'self'/);
    assert.match(config, /connect-src 'none'/);
    assert.doesNotMatch(config, /unsafe-inline|unsafe-eval/);
});
