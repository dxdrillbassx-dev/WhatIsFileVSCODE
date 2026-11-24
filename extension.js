// File Header Banner — простая плоская шапка в новые файлы
const vscode = require('vscode');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const PLACEHOLDER = '<add description>';

// язык + символ комментария для каждого расширения
const LANG = {
    'js':   { name: 'JavaScript',          cont: '// ' },
    'jsx':  { name: 'JavaScript React',    cont: '// ' },
    'mjs':  { name: 'JavaScript Module',   cont: '// ' },
    'cjs':  { name: 'JavaScript CommonJS', cont: '// ' },
    'ts':   { name: 'TypeScript',          cont: '// ' },
    'tsx':  { name: 'TypeScript React',    cont: '// ' },
    'c':    { name: 'C',                   cont: '// ' },
    'h':    { name: 'C/C++ Header',        cont: '// ' },
    'cpp':  { name: 'C++',                 cont: '// ' },
    'hpp':  { name: 'C++ Header',          cont: '// ' },
    'cc':   { name: 'C++',                 cont: '// ' },
    'hh':   { name: 'C++ Header',          cont: '// ' },
    'cxx':  { name: 'C++',                 cont: '// ' },
    'cs':   { name: 'C#',                  cont: '// ' },
    'java': { name: 'Java',                cont: '// ' },
    'kt':   { name: 'Kotlin',              cont: '// ' },
    'kts':  { name: 'Kotlin Script',       cont: '// ' },
    'go':   { name: 'Go',                  cont: '// ' },
    'rs':   { name: 'Rust',                cont: '// ' },
    'swift':{ name: 'Swift',               cont: '// ' },
    'scala':{ name: 'Scala',               cont: '// ' },
    'groovy':{name: 'Groovy',              cont: '// ' },
    'php':  { name: 'PHP',                 cont: '// ' },
    'css':  { name: 'CSS',                 cont: '// ' },
    'scss': { name: 'SCSS',                cont: '// ' },
    'sass': { name: 'Sass',                cont: '// ' },
    'less': { name: 'Less',                cont: '// ' },
    'ino':  { name: 'Arduino',             cont: '// ' },
    'json': { name: 'JSON',                cont: '// ' },
    'jsonc':{ name: 'JSON with Comments',  cont: '// ' },
    'py':   { name: 'Python',              cont: '# ' },
    'pyw':  { name: 'Python',              cont: '# ' },
    'rb':   { name: 'Ruby',                cont: '# ' },
    'sh':   { name: 'Shell',               cont: '# ' },
    'bash': { name: 'Bash',                cont: '# ' },
    'zsh':  { name: 'Zsh',                 cont: '# ' },
    'yaml': { name: 'YAML',                cont: '# ' },
    'yml':  { name: 'YAML',                cont: '# ' },
    'toml': { name: 'TOML',                cont: '# ' },
    'pl':   { name: 'Perl',                cont: '# ' },
    'pm':   { name: 'Perl Module',         cont: '# ' },
    'r':    { name: 'R',                   cont: '# ' },
    'ps1':  { name: 'PowerShell',          cont: '# ' },
    'psm1': { name: 'PowerShell Module',   cont: '# ' },
    'lua':  { name: 'Lua',                 cont: '-- ' },
    'sql':  { name: 'SQL',                 cont: '-- ' },
    'hs':   { name: 'Haskell',             cont: '-- ' },
    'elm':  { name: 'Elm',                 cont: '-- ' },
    'html': { name: 'HTML',                start: '<!--', cont: '  ', end: '-->' },
    'htm':  { name: 'HTML',                start: '<!--', cont: '  ', end: '-->' },
    'xml':  { name: 'XML',                 start: '<!--', cont: '  ', end: '-->' },
    'svg':  { name: 'SVG',                 start: '<!--', cont: '  ', end: '-->' },
    'md':   { name: 'Markdown',            start: '<!--', cont: '  ', end: '-->' },
    'markdown': { name: 'Markdown',        start: '<!--', cont: '  ', end: '-->' },
    // текстовые и прочие форматы
    'txt':  { name: 'Plain Text',          cont: '# ' },
    'text': { name: 'Plain Text',          cont: '# ' },
    'log':  { name: 'Log',                 cont: '# ' },
    'csv':  { name: 'CSV',                 cont: '# ' },
    'tsv':  { name: 'TSV',                 cont: '# ' },
    'ini':  { name: 'INI',                 cont: '; ' },
    'conf': { name: 'Config',              cont: '; ' },
    'cfg':  { name: 'Config',              cont: '# ' },
    'env':  { name: 'Environment',         cont: '# ' },
    'gitignore': { name: 'Git Ignore',     cont: '# ' },
    'gitattributes': { name: 'Git Attributes', cont: '# ' },
    'bat':  { name: 'Batch',               cont: ':: ' },
    'cmd':  { name: 'Batch',               cont: ':: ' },
    'dockerfile': { name: 'Dockerfile',    cont: '# ' },
    'properties': { name: 'Properties',    cont: '# ' }
};

// неизвестное расширение или его нет — универсальный стиль
function langFor(ext) {
    if (LANG[ext]) return LANG[ext];
    return { name: ext ? ext.toUpperCase() : 'Text', cont: '# ' };
}

function fmtDate(d) {
    const p = x => String(x).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function detectAuthor() {
    const cfg = vscode.workspace.getConfiguration('fileHeaderBanner').get('author');
    if (cfg && cfg.trim()) return cfg.trim();
    try {
        const g = execSync('git config user.name', {
            stdio: ['ignore', 'pipe', 'ignore'],
            cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || undefined
        }).toString().trim();
        if (g) return g;
    } catch (e) { /* not a git repo */ }
    try { return os.userInfo().username; } catch (e) { return 'unknown'; }
}

function buildLines(file, langName, project, author, relPath) {
    const now = fmtDate(new Date());
    return [
        `${file} — ${PLACEHOLDER}`,
        `Проект: ${project} | Язык: ${langName} | Автор: ${author}`,
        `Создан: ${now} | Изменён: ${now} (${author})`,
        `Путь: ${relPath}`,
        ''   // пустая строка-комментарий — под неё дополняешь своё
    ];
}

function render(lines, style) {
    if (style.start) {
        return [style.start, ...lines.map(r => (style.cont || '  ') + r), style.end].join('\n') + '\n\n';
    }
    return lines.map(r => style.cont + r).join('\n') + '\n\n';
}

function hasBanner(doc) {
    const end = doc.positionAt(Math.min(doc.getText().length, 2000));
    const head = doc.getText(new vscode.Range(new vscode.Position(0, 0), end));
    // новый плоский формат
    if (head.includes('Изменён:') && head.includes('Создан:')) return true;
    // старый боксовый формат (v1.0.0)
    if (head.includes('╔') && head.includes('Modified') && head.includes('Created')) return true;
    return false;
}

async function insertBanner(editor) {
    const doc = editor.document;
    const ext = path.extname(doc.fileName).slice(1).toLowerCase();
    const lang = langFor(ext);   // любой файл: известный или универсальный '# '
    if (hasBanner(doc)) {
        vscode.window.showInformationMessage('Шапка уже есть — Изменён обновится при сохранении');
        return;
    }
    const rel = vscode.workspace.asRelativePath(doc.uri);
    const folder = vscode.workspace.getWorkspaceFolder(doc.uri);
    const project = folder ? folder.name : '(вне проекта)';
    const author = detectAuthor();
    const banner = render(buildLines(path.basename(doc.fileName), lang.name, project, author, rel), lang);

    const ok = await editor.edit(
        eb => eb.insert(new vscode.Position(0, 0), banner),
        { undoStopBefore: true, undoStopAfter: false }
    );
    if (!ok) return;

    // сразу выделяем плейсхолдер описания, чтобы печатать поверх
    const idx = doc.getText().indexOf(PLACEHOLDER);
    if (idx >= 0) {
        const start = doc.positionAt(idx);
        const end = doc.positionAt(idx + PLACEHOLDER.length);
        editor.selection = new vscode.Selection(start, end);
        editor.revealRange(new vscode.Range(start, end));
    }
}

function activate(context) {
    // команда из палитры / контекстного меню
    context.subscriptions.push(vscode.commands.registerCommand('fileHeaderBanner.insert', async () => {
        const ed = vscode.window.activeTextEditor;
        if (ed) await insertBanner(ed);
    }));

    // автовставка в новые файлы — ЛЮБЫЕ файлы
    context.subscriptions.push(vscode.workspace.onDidCreateFiles(async ev => {
        const cfg = vscode.workspace.getConfiguration('fileHeaderBanner');
        if (!cfg.get('autoInsert')) return;
        for (const f of ev.files) {
            try {
                if (f.scheme !== 'file') continue;
                if (f.fsPath.includes('node_modules') || f.fsPath.includes('.git' + path.sep)) continue;
                const doc = await vscode.workspace.openTextDocument(f);
                if (doc.getText().trim().length > 0) continue; // только пустые новые файлы
                const editor = await vscode.window.showTextDocument(doc);
                await insertBanner(editor);
            } catch (e) { console.error('File Header Banner:', e); }
        }
    }));

    // обновление строки "Изменён" при сохранении (внутри самого сохранения, без петель)
    context.subscriptions.push(vscode.workspace.onWillSaveTextDocument(ev => {
        const cfg = vscode.workspace.getConfiguration('fileHeaderBanner');
        if (!cfg.get('updateOnSave')) return;
        const doc = ev.document;
        if (!hasBanner(doc)) return;
        const now = fmtDate(new Date());
        const author = detectAuthor();
        const re = /^(.*?\bИзмен[её]н\s*:\s*)(\d{4}-\d{2}-\d{2} \d{2}:\d{2})( \([^)]*\))?(.*)$/;
        for (let i = 0; i < Math.min(20, doc.lineCount); i++) {
            const line = doc.lineAt(i).text;
            if (!line.includes('Изменён:')) continue;
            const m = line.match(re);
            if (!m) continue;
            const edit = new vscode.WorkspaceEdit();
            edit.replace(doc.uri, doc.lineAt(i).range, `${m[1]}${now} (${author})${m[4]}`);
            ev.waitUntil(Promise.resolve(edit));
            return;
        }
    }));
}

function deactivate() {}

module.exports = { activate, deactivate };
