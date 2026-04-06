import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Ajv from 'ajv';
import type { ErrorObject } from 'ajv';
import {
	RUNIC_SECTORS,
	type ResolvedRunicLibrary,
	type ResolvedRunicLibraryEntry,
	type RunicDocument,
	type RunicLibraryIndex,
	type RunicLibraryIndexEntry,
	type RunicRef
} from './contracts';

const RUNES_ROOT = path.resolve(fileURLToPath(new URL('../../../../runes', import.meta.url)));
const RUNIC_INDEX_PATH = path.resolve(RUNES_ROOT, 'index/library.json');
const RUNIC_SCHEMA_PATH = path.resolve(RUNES_ROOT, 'schema/rune-document.schema.json');

const ajv = new Ajv({
	allErrors: true,
	jsonPointers: true
});

let compiledValidator: Ajv.ValidateFunction | null = null;
let cachedLibrary: ResolvedRunicLibrary | null = null;

function readJsonFile<T>(fullPath: string): T {
	return JSON.parse(fs.readFileSync(fullPath, 'utf-8')) as T;
}

function getRunicSchemaValidator() {
	if (compiledValidator) {
		return compiledValidator;
	}

	const schema = readJsonFile<object>(RUNIC_SCHEMA_PATH);
	compiledValidator = ajv.compile(schema);
	return compiledValidator;
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
	if (!errors || errors.length === 0) {
		return 'Unknown validation error';
	}

	return errors
		.map((error) => {
			const dataPath = error.dataPath || '(root)';
			return `${dataPath} ${error.message}`;
		})
		.join('; ');
}

function createLocalRefSet(document: RunicDocument) {
	const refs = new Set<RunicRef>();

	for (const element of document.topology.elements) {
		refs.add(`element:${element.id}`);
	}

	for (const instance of document.instances ?? []) {
		refs.add(`instance:${instance.id}`);
	}

	return refs;
}

function assertDocumentIdExists(documentId: string, documentsById: Record<string, RunicDocument>, documentPath: string) {
	if (!documentsById[documentId]) {
		throw new Error(`Invalid runic document at ${documentPath}: unresolved document id ${documentId}`);
	}
}

function assertLocalRefExists(ref: RunicRef, refs: Set<RunicRef>, documentPath: string, context: string) {
	if (!refs.has(ref)) {
		throw new Error(`Invalid runic document at ${documentPath}: ${context} references unknown ref ${ref}`);
	}
}

function assertCanonicalSectors(document: RunicDocument, documentPath: string) {
	const sectorNames = document.projection2d.system.sectors.map((sector) => sector.name);
	if (sectorNames.length !== RUNIC_SECTORS.length) {
		throw new Error(`Invalid runic document at ${documentPath}: expected ${RUNIC_SECTORS.length} sectors`);
	}

	for (const [index, sector] of RUNIC_SECTORS.entries()) {
		if (sectorNames[index] !== sector) {
			throw new Error(
				`Invalid runic document at ${documentPath}: sector ${index} must be ${sector}, got ${sectorNames[index]}`
			);
		}
	}
}

export function validateRunicDocumentData(document: unknown): document is RunicDocument {
	const validator = getRunicSchemaValidator();
	return Boolean(validator(document));
}

export function assertValidRunicDocumentData(document: unknown, documentPath = '(inline)'): RunicDocument {
	const validator = getRunicSchemaValidator();

	if (!validator(document)) {
		throw new Error(`Invalid runic document at ${documentPath}: ${formatAjvErrors(validator.errors)}`);
	}

	return document as RunicDocument;
}

export function assertRunicDocumentIntegrity(
	document: RunicDocument,
	documentsById: Record<string, RunicDocument>,
	documentPath = '(inline)'
) {
	assertCanonicalSectors(document, documentPath);

	for (const importId of document.imports ?? []) {
		assertDocumentIdExists(importId, documentsById, documentPath);
	}

	for (const instance of document.instances ?? []) {
		assertDocumentIdExists(instance.documentId, documentsById, documentPath);
	}

	const localRefs = createLocalRefSet(document);

	for (const relation of document.topology.relations) {
		assertLocalRefExists(relation.source, localRefs, documentPath, `relation ${relation.id}`);
		assertLocalRefExists(relation.target, localRefs, documentPath, `relation ${relation.id}`);
	}

	for (const geometryEntry of document.geometry.entries) {
		assertLocalRefExists(geometryEntry.ref, localRefs, documentPath, 'geometry entry');
	}

	const placementRefs = new Set<RunicRef>();
	for (const placement of document.projection2d.placements) {
		assertLocalRefExists(placement.ref, localRefs, documentPath, 'projection placement');
		placementRefs.add(placement.ref);
	}

	const relationIds = new Set(document.topology.relations.map((relation) => relation.id));
	for (const relationPath of document.projection2d.relationPaths) {
		if (!relationIds.has(relationPath.relationId)) {
			throw new Error(
				`Invalid runic document at ${documentPath}: projection path ${relationPath.relationId} references unknown relation`
			);
		}

		if (!placementRefs.has(relationPath.source) || !placementRefs.has(relationPath.target)) {
			throw new Error(
				`Invalid runic document at ${documentPath}: projection path ${relationPath.relationId} references missing placement`
			);
		}
	}

	return document;
}

export function loadRunicLibraryIndex(): RunicLibraryIndex {
	return readJsonFile<RunicLibraryIndex>(RUNIC_INDEX_PATH);
}

export function resolveRunicIndexEntry(indexEntry: RunicLibraryIndexEntry): ResolvedRunicLibraryEntry {
	const fullPath = path.resolve(path.dirname(RUNIC_INDEX_PATH), '..', '..', indexEntry.file.replaceAll('/', path.sep));
	const document = assertValidRunicDocumentData(readJsonFile<unknown>(fullPath), fullPath);

	if (document.id !== indexEntry.id) {
		throw new Error(
			`Index entry id mismatch for ${indexEntry.file}: expected ${indexEntry.id}, got ${document.id}`
		);
	}

	return {
		...indexEntry,
		document
	};
}

export function loadResolvedRunicLibrary(options: { forceReload?: boolean } = {}): ResolvedRunicLibrary {
	if (cachedLibrary && !options.forceReload) {
		return cachedLibrary;
	}

	const index = loadRunicLibraryIndex();
	const documentsById: Record<string, RunicDocument> = {};
	const groups = index.groups.map((group) => {
		const entries = group.entries.map((entry) => resolveRunicIndexEntry(entry));
		for (const entry of entries) {
			documentsById[entry.id] = entry.document;
		}

		return {
			...group,
			entries
		};
	});

	for (const group of groups) {
		for (const entry of group.entries) {
			assertRunicDocumentIntegrity(entry.document, documentsById, entry.file);
		}
	}

	cachedLibrary = {
		version: index.version,
		groups,
		documentsById
	};

	return cachedLibrary;
}

export function getRunicDocumentById(documentId: string): RunicDocument {
	const library = loadResolvedRunicLibrary();
	const document = library.documentsById[documentId];
	if (!document) {
		throw new Error(`Runic document ${documentId} not found`);
	}

	return document;
}

export function getRunicPaths() {
	return {
		root: RUNES_ROOT,
		index: RUNIC_INDEX_PATH,
		schema: RUNIC_SCHEMA_PATH
	};
}
