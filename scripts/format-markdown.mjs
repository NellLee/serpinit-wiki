import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const WRITE = process.argv.includes('--write')
const TARGET_EXTENSIONS = new Set(['.md'])
const SKIP_DIRS = new Set(['.git', 'node_modules', 'output', 'tmp'])
const SENTINEL = '\uE000'

const protectedPatterns = [
	/\bz\.\s?B\./gi,
	/\bu\.\s?a\./gi,
	/\bd\.\s?h\./gi,
	/\bbzw\./gi,
	/\bca\./gi,
	/\bNr\./g,
	/\bvgl\./gi,
	/\betc\./gi,
	/\bbspw\./gi,
	/\bu\.?\s?U\./gi,
	/\bS\./g,
	/\bDr\./g,
	/\bProf\./g
]

function walk(dirPath) {
	const entries = fs.readdirSync(dirPath, { withFileTypes: true })
	const results = []

	for (const entry of entries) {
		if (entry.isDirectory()) {
			if (SKIP_DIRS.has(entry.name)) {
				continue
			}
			results.push(...walk(path.join(dirPath, entry.name)))
			continue
		}

		if (TARGET_EXTENSIONS.has(path.extname(entry.name))) {
			results.push(path.join(dirPath, entry.name))
		}
	}

	return results
}

function isProtectedLine(line) {
	const trimmed = line.trim()
	if (trimmed === '') {
		return true
	}

	return (
		/^\s*#/.test(line) ||
		/^\s*>/.test(line) ||
		/^\s*(?:[-+*]|\d+\.)\s+/.test(line) ||
		/^\s*!\[[^\]]*\]\([^)]+\)/.test(line) ||
		/^\s*\|/.test(line) ||
		/^\s*(?:---|\*\*\*|___)\s*$/.test(line) ||
		/^\s*:::+/.test(line) ||
		/^\s*§/.test(line) ||
		/^\s*<!--/.test(line) ||
		/^\s*<[^>]+>/.test(line)
	)
}

function joinParagraphLines(lines) {
	let result = ''

	for (const line of lines) {
		const trimmed = line.trim()
		if (trimmed === '') {
			continue
		}

		if (result === '') {
			result = trimmed
			continue
		}

		const noSpaceBefore =
			/[_*[(/{„"]$/.test(result) || /^[\])}.,;:!?*_]/.test(trimmed)

		result += noSpaceBefore ? trimmed : ` ${trimmed}`
	}

	return result
}

function normalizeParagraph(paragraph) {
	let text = joinParagraphLines(paragraph.split('\n')).replace(/\s+/g, ' ').trim()
	if (text === '') {
		return paragraph
	}

	text = text.replace(/(?<=\d)\.(?=\d)/g, SENTINEL)

	for (const pattern of protectedPatterns) {
		text = text.replace(pattern, (match) => match.replaceAll('.', SENTINEL))
	}

	const parts = text
		.split(/(?<=[.!?])\s+(?=[A-ZÄÖÜ„"(\[]|$)/)
		.map((part) => part.trim())
		.filter(Boolean)
		.map((part) => part.replaceAll(SENTINEL, '.'))

	return parts.join('\n')
}

function formatMarkdown(content) {
	const lines = content.split(/\r?\n/)
	const output = []
	const paragraph = []
	let inFence = false
	const directiveStack = []
	let modified = false

	const flushParagraph = () => {
		if (paragraph.length === 0) {
			return
		}

		const original = paragraph.join('\n')
		const formatted = normalizeParagraph(original)
		if (formatted !== original) {
			modified = true
		}
		output.push(...formatted.split('\n'))
		paragraph.length = 0
	}

	for (const line of lines) {
		const trimmed = line.trim()

		if (/^\s*```/.test(line)) {
			flushParagraph()
			inFence = !inFence
			output.push(line)
			continue
		}

		if (inFence) {
			output.push(line)
			continue
		}

		const directiveMatch = trimmed.match(/^(:{3,})(.*)$/)
		if (directiveMatch) {
			flushParagraph()
			output.push(line)
			const marker = directiveMatch[1]
			const rest = directiveMatch[2].trim()

			if (rest === '') {
				if (directiveStack.at(-1) === marker) {
					directiveStack.pop()
				}
			} else {
				directiveStack.push(marker)
			}
			continue
		}

		if (directiveStack.length > 0) {
			output.push(line)
			continue
		}

		if (trimmed === '') {
			flushParagraph()
			output.push(line)
			continue
		}

		if (isProtectedLine(line)) {
			flushParagraph()
			output.push(line)
			continue
		}

		paragraph.push(line)
	}

	flushParagraph()

	return {
		content: output.join('\n'),
		modified
	}
}

const files = walk(ROOT)
let modifiedFiles = 0

for (const filePath of files) {
	const original = fs.readFileSync(filePath, 'utf8')
	const { content, modified } = formatMarkdown(original)

	if (!modified) {
		continue
	}

	modifiedFiles++
	if (WRITE) {
		fs.writeFileSync(filePath, content, 'utf8')
	}
	console.log(path.relative(ROOT, filePath))
}

console.log(`Modified files: ${modifiedFiles}`)
