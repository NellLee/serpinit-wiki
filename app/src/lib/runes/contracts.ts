export const ONTOLOGY_CLASSES = [
	'substrat',
	'fluss',
	'leib',
	'geist',
	'ort',
	'bindung',
	'grenze',
	'wandel',
	'potenz'
] as const;

export const PROCESS_ROLES = [
	'leiten',
	'stauen',
	'teilen',
	'binden',
	'abschirmen',
	'ausrichten',
	'wandeln',
	'koppeln',
	'begrenzen',
	'entfalten',
	'praegen'
] as const;

export const PRIMITIVE_KINDS = [
	'leitbahn',
	'drossel',
	'kammer',
	'gabel',
	'anker',
	'mantel',
	'sperre'
] as const;

export const RUNIC_SECTORS = [
	'auslass',
	'lenkung',
	'entfaltung',
	'spaltung',
	'praegung',
	'siegelung',
	'sammlung',
	'begrenzung'
] as const;

export const SHAPE_FAMILIES = [
	'channel',
	'throat',
	'chamber',
	'fork',
	'anchor',
	'ring',
	'barrier'
] as const;

export type OntologyClass = (typeof ONTOLOGY_CLASSES)[number];
export type ProcessRole = (typeof PROCESS_ROLES)[number];
export type PrimitiveKind = (typeof PRIMITIVE_KINDS)[number];
export type RunicSector = (typeof RUNIC_SECTORS)[number];
export type ShapeFamily = (typeof SHAPE_FAMILIES)[number];
export type RunicDocumentKind = 'primitive' | 'structure' | 'rune';
export type RunicRef = `${'element' | 'instance'}:${string}`;

export type RelationKind =
	| 'feeds'
	| 'bounds'
	| 'anchors'
	| 'modulates'
	| 'contains'
	| 'branches-to';

export type RelationPathMode = 'radial' | 'arc' | 'radial-arc' | 'bridge';
export type GravitativeMode = 'hebend' | 'senkend';
export type PolarMode = 'polwaerts' | 'feldwaerts';
export type RotativeMode = 'fortlaufend' | 'gegenlaufend';
export type GravityReference = 'up-opposes-gravity';
export type AnchorReference = 'outward-follows-primary-anchor' | 'outward-follows-structure';

export type RunicSemantics = {
	ontologyClasses: OntologyClass[];
	processRoles: ProcessRole[];
};

export type RunicElement = {
	id: string;
	kind: PrimitiveKind;
	semanticRole: string;
	ontologyClasses?: OntologyClass[];
};

export type RunicRelation = {
	id: string;
	kind: RelationKind;
	source: RunicRef;
	target: RunicRef;
};

export type RunicLayer = {
	id: string;
	index: number;
	name: string;
};

export type RunicTopology = {
	elements: RunicElement[];
	relations: RunicRelation[];
	layers: RunicLayer[];
	flow: {
		direction: 'radial-outward';
		allowsReturn: boolean;
	};
};

export type RunicGeometryEntry = {
	ref: RunicRef;
	center: {
		radius: number;
		angleDegrees: number;
	};
	size: {
		radial: number;
		angular: number;
	};
	rotationDegrees: number;
};

export type RunicGeometry = {
	space: {
		kind: 'core-relative';
		dimensions: 2;
	};
	entries: RunicGeometryEntry[];
};

export type ProjectionSectorDefinition = {
	name: RunicSector;
	gravitativeMode: GravitativeMode;
	polarMode: PolarMode;
	rotativeMode: RotativeMode;
};

export type ProjectionOrientationFrame = {
	gravityReference: GravityReference;
	anchorReference: AnchorReference;
	notes: string;
};

export type ProjectionPlacement = {
	ref: RunicRef;
	layer: number;
	layerOffset?: number;
	sector: RunicSector;
	sectorOffset?: number;
	radialSpan: number;
	sectorSpan: number;
	shapeFamily: ShapeFamily;
};

export type ProjectionRelationPath = {
	relationId: string;
	mode: RelationPathMode;
	source: RunicRef;
	target: RunicRef;
};

export type RunicProjection2D = {
	system: {
		kind: 'vendotic-radial';
		layerCount: number;
		sectors: ProjectionSectorDefinition[];
		orientationFrame: ProjectionOrientationFrame;
	};
	placements: ProjectionPlacement[];
	relationPaths: ProjectionRelationPath[];
};

export type RunicInstance = {
	id: string;
	documentId: string;
	role: string;
};

export type RunicDocumentBase = {
	id: string;
	name: string;
	kind: RunicDocumentKind;
	version: string;
	description: string;
	semantics: RunicSemantics;
	topology: RunicTopology;
	geometry: RunicGeometry;
	projection2d: RunicProjection2D;
	constraints?: string[];
	imports?: string[];
	instances?: RunicInstance[];
	notes?: string[];
};

export type PrimitiveRunicDocument = RunicDocumentBase & {
	kind: 'primitive';
};

export type StructureRunicDocument = RunicDocumentBase & {
	kind: 'structure';
};

export type RuneDocument = RunicDocumentBase & {
	kind: 'rune';
};

export type RunicDocument = PrimitiveRunicDocument | StructureRunicDocument | RuneDocument;

export type RunicLibraryIndexEntry = {
	id: string;
	name: string;
	file: string;
};

export type RunicLibraryIndexGroup = {
	kind: RunicDocumentKind;
	name: string;
	entries: RunicLibraryIndexEntry[];
};

export type RunicLibraryIndex = {
	version: string;
	groups: RunicLibraryIndexGroup[];
};

export type ResolvedRunicLibraryEntry = RunicLibraryIndexEntry & {
	document: RunicDocument;
};

export type ResolvedRunicLibraryGroup = Omit<RunicLibraryIndexGroup, 'entries'> & {
	entries: ResolvedRunicLibraryEntry[];
};

export type ResolvedRunicLibrary = {
	version: string;
	groups: ResolvedRunicLibraryGroup[];
	documentsById: Record<string, RunicDocument>;
};
