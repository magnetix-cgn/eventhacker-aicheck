// Build only: this command never connects to or changes a hosting server.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const {execFileSync} = require('node:child_process');

const files = ['index.html', 'assets/app.js', 'assets/app.css', 'assets/icon.svg', '.htaccess'];
const root = path.resolve(__dirname, '..');
const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8'}).trim();
let temporary;
try {
    const [sha, destination] = process.argv.slice(2);
    if (!/^[a-f0-9]{40}$/.test(sha || '') || !destination) {
        throw new Error('Usage: node scripts/prepare-release.cjs FULL_SHA NEW_OUTPUT_DIRECTORY');
    }
    if (git('rev-parse', 'HEAD') !== sha || git('status', '--porcelain')) {
        throw new Error('Release requires the exact current committed SHA and a clean checkout.');
    }
    const output = path.resolve(destination);
    if (output === root || output.startsWith(root + path.sep)) {
        throw new Error('Release output must be outside the repository.');
    }
    if (fs.existsSync(output)) throw new Error('Output already exists; refusing overwrite.');
    temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'aicheck-release-'));
    const manifest = {commit: sha, files: []};
    for (const file of files) {
        if (!git('ls-tree', sha, '--', file).startsWith('100644 blob ')) {
            throw new Error('Expected a regular committed asset: ' + file);
        }
        const content = execFileSync('git', ['show', sha + ':' + file], {cwd: root});
        const target = path.join(temporary, file);
        fs.mkdirSync(path.dirname(target), {recursive: true});
        fs.writeFileSync(target, content, {flag: 'wx'});
        manifest.files.push({path: file, bytes: content.length,
            sha256: crypto.createHash('sha256').update(content).digest('hex')});
    }
    fs.mkdirSync(output, {recursive: false});
    const archive = path.join(output, 'release.tar');
    execFileSync('tar', ['-cf', archive, '-C', temporary, '--', ...files]);
    manifest.archive_sha256 = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
    fs.writeFileSync(path.join(output, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n', {flag: 'wx'});
    console.log('Prepared ' + sha + ' in ' + output + '; not deployed.');
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
} finally {
    if (temporary) fs.rmSync(temporary, {recursive: true, force: true});
}
