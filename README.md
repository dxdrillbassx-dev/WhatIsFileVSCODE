# File Header Banner

Простая плоская шапка-комментарий в каждый новый файл, созданный через VS Code — **в любой файл, включая .txt и файлы без расширения**. Без рамок, дополняется руками на бегу.

```
// notes.txt — <add description>
// Проект: KUNOTOOLS | Язык: Plain Text | Автор: kuno
// Создан: 2026-11-24 23:15 | Изменён: 2026-11-24 23:15 (kuno)
// Путь: docs/notes.txt
//
```

## Что умеет

- **Автовставка в любой новый файл** (пустой): создал файл в проводнике VS Code → шапка появилась сама, `<add description>` сразу выделен — печатай поверх.
- **Стиль комментария под язык**: `//` C/C++/C#/JS/TS/Java/Go/Rust/PHP/CSS/JSON..., `#` Python/Shell/YAML/txt/log/csv..., `--` Lua/SQL, `;` INI, `::` bat, `<!-- -->` HTML/XML/Markdown. Неизвестный формат → `# `, язык = расширение в верхнем регистре.
- **Изменён обновляется сам** при сохранении (дата + кто; имя из git config, fallback — имя пользователя ОС).
- **Вручную**: F1 → `Insert/Update File Header Banner`, или правый клик в редакторе/проводнике.

## Настройки (Settings → "File Header Banner")

| Настройка | По умолчанию | Что делает |
|---|---|---|
| `fileHeaderBanner.autoInsert` | `true` | автовставка в новые файлы |
| `fileHeaderBanner.updateOnSave` | `true` | обновлять Изменён при сохранении |
| `fileHeaderBanner.author` | `""` | имя автора (пусто = git/ОС) |

## Установка

Extensions (Ctrl+Shift+X) → `...` → **Install from VSIX** → выбрать `file-header-banner.vsix`.

## Файлы

- `package.json` — манифест (команды, настройки, активация)
- `extension.js` — вся логика (таблица языков `LANG` — добавить свой = одна строка)
