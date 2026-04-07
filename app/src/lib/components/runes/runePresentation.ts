import type {
	ResolvedRunicLibrary,
	ResolvedRunicLibraryEntry,
	RelationPathMode,
	RunicDocument,
	RunicSector,
	ShapeFamily
} from '$lib/runes/contracts';
import {
	deriveRunicProjection,
	type DerivedProjectionPlacement,
	type DerivedProjectionSector
} from '$lib/runes/projection';

const CANVAS_SIZE = 640;
const CENTER = CANVAS_SIZE / 2;
const OUTER_RADIUS = 240;

export type PresentedRuneShape = {
	ref: string;
	shapeFamily: ShapeFamily;
	path: string;
	label: string;
	labelX: number;
	labelY: number;
};

export type PresentedRuneRelation = {
	relationId: string;
	mode: RelationPathMode;
	path: string;
	emphasis: 'primary' | 'secondary';
	layering: 'below-shapes' | 'above-shapes';
};

export type RunePresentation = {
	document: RunicDocument;
	canvasSize: number;
	center: number;
	layerRadii: number[];
	sectors: DerivedProjectionSector[];
	shapes: PresentedRuneShape[];
	relations: PresentedRuneRelation[];
	shapeFamilies: ShapeFamily[];
	oppositions: Array<{ left: RunicSector; right: RunicSector }>;
	orientationSummary: string;
};

const OPPOSITIONS: Array<{ left: RunicSector; right: RunicSector }> = [
	{ left: 'auslass', right: 'begrenzung' },
	{ left: 'lenkung', right: 'sammlung' },
	{ left: 'entfaltung', right: 'siegelung' },
	{ left: 'spaltung', right: 'praegung' }
];

function toRadians(angleDegrees: number) {
	return (angleDegrees * Math.PI) / 180;
}

function polarToCartesian(angleDegrees: number, radius: number) {
	const radians = toRadians(angleDegrees);
	return {
		x: CENTER + Math.cos(radians) * radius,
		y: CENTER + Math.sin(radians) * radius
	};
}

function createBandPath(placement: DerivedProjectionPlacement) {
	const innerRadius = placement.innerRadius * OUTER_RADIUS;
	const outerRadius = placement.outerRadius * OUTER_RADIUS;
	const startOuter = polarToCartesian(placement.startAngle, outerRadius);
	const endOuter = polarToCartesian(placement.endAngle, outerRadius);
	const startInner = polarToCartesian(placement.startAngle, innerRadius);
	const endInner = polarToCartesian(placement.endAngle, innerRadius);
	const largeArc = placement.endAngle - placement.startAngle > 180 ? 1 : 0;

	return [
		`M ${startOuter.x} ${startOuter.y}`,
		`A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
		`L ${endInner.x} ${endInner.y}`,
		`A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
		'Z'
	].join(' ');
}

function createArcPath(source: DerivedProjectionPlacement, target: DerivedProjectionPlacement) {
	const radius = ((source.innerRadius + source.outerRadius + target.innerRadius + target.outerRadius) / 4) * OUTER_RADIUS;
	const start = polarToCartesian(source.centerAngle, radius);
	const end = polarToCartesian(target.centerAngle, radius);
	const largeArc = Math.abs(target.centerAngle - source.centerAngle) > 180 ? 1 : 0;
	const sweep = target.centerAngle >= source.centerAngle ? 1 : 0;
	return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`;
}

function normalizeDeltaAngle(from: number, to: number) {
	let delta = to - from;

	while (delta > 180) delta -= 360;
	while (delta < -180) delta += 360;

	return delta;
}

function createRelationPath(source: DerivedProjectionPlacement, target: DerivedProjectionPlacement, mode: RelationPathMode) {
	const sourceRadius = ((source.innerRadius + source.outerRadius) / 2) * OUTER_RADIUS;
	const targetRadius = ((target.innerRadius + target.outerRadius) / 2) * OUTER_RADIUS;
	const sourcePoint = polarToCartesian(source.centerAngle, sourceRadius);
	const targetPoint = polarToCartesian(target.centerAngle, targetRadius);
	const deltaAngle = normalizeDeltaAngle(source.centerAngle, target.centerAngle);

	if (mode === 'strahl') {
		return `M ${sourcePoint.x} ${sourcePoint.y} L ${targetPoint.x} ${targetPoint.y}`;
	}

	if (mode === 'bogen') {
		const shellRadius = Math.max(sourceRadius, targetRadius) + 20;
		const start = polarToCartesian(source.centerAngle, shellRadius);
		const end = polarToCartesian(target.centerAngle, shellRadius);
		const largeArc = Math.abs(deltaAngle) > 180 ? 1 : 0;
		const sweep = deltaAngle >= 0 ? 1 : 0;
		return [
			`M ${sourcePoint.x} ${sourcePoint.y}`,
			`L ${start.x} ${start.y}`,
			`A ${shellRadius} ${shellRadius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`,
			`L ${targetPoint.x} ${targetPoint.y}`
		].join(' ');
	}

	if (mode === 'strahlbogen') {
		const pivotRadius = Math.max(sourceRadius, targetRadius) + 14;
		const pivotAngle = source.centerAngle + deltaAngle * 0.45;
		const arcStart = polarToCartesian(source.centerAngle, pivotRadius);
		const pivot = polarToCartesian(pivotAngle, pivotRadius);
		const arcEnd = polarToCartesian(target.centerAngle, pivotRadius - 10);
		const largeArc = Math.abs(deltaAngle) > 180 ? 1 : 0;
		const sweep = deltaAngle >= 0 ? 1 : 0;
		return [
			`M ${sourcePoint.x} ${sourcePoint.y}`,
			`L ${arcStart.x} ${arcStart.y}`,
			`L ${pivot.x} ${pivot.y}`,
			`A ${pivotRadius} ${pivotRadius} 0 ${largeArc} ${sweep} ${arcEnd.x} ${arcEnd.y}`,
			`L ${targetPoint.x} ${targetPoint.y}`
		].join(' ');
	}

	const bridgeRadius = Math.max(Math.min(sourceRadius, targetRadius) - 26, OUTER_RADIUS * 0.2);
	const bridgeAngle = source.centerAngle + deltaAngle / 2;
	const control = polarToCartesian(bridgeAngle, bridgeRadius);
	return `M ${sourcePoint.x} ${sourcePoint.y} Q ${control.x} ${control.y} ${targetPoint.x} ${targetPoint.y}`;
}

function relationEmphasis(mode: RelationPathMode): PresentedRuneRelation['emphasis'] {
	return mode === 'strahlbogen' || mode === 'bruecke' ? 'primary' : 'secondary';
}

function relationLayering(mode: RelationPathMode): PresentedRuneRelation['layering'] {
	return mode === 'strahlbogen' || mode === 'bruecke' ? 'above-shapes' : 'below-shapes';
}

function createLabel(ref: string) {
	return ref.replace(/^element:/, '').replace(/^instance:/, '');
}

function summarizeOrientation(document: RunicDocument) {
	const { gravityReference, anchorReference, notes } = document.projection2d.system.orientationFrame;
	return `${gravityReference} | ${anchorReference} | ${notes}`;
}

export function createRunePresentation(document: RunicDocument): RunePresentation {
	const projection = deriveRunicProjection(document);
	const layerRadii = Array.from({ length: projection.layerCount + 1 }, (_, index) =>
		(index / projection.layerCount) * OUTER_RADIUS
	);
	const shapes = projection.placements.map((placement) => {
		const labelPoint = polarToCartesian(
			placement.centerAngle,
			((placement.innerRadius + placement.outerRadius) / 2) * OUTER_RADIUS
		);

		return {
			ref: placement.ref,
			shapeFamily: placement.shapeFamily,
			path: createBandPath(placement),
			label: createLabel(placement.ref),
			labelX: labelPoint.x,
			labelY: labelPoint.y
		};
	});
	const relations = projection.relationPaths.map((relationPath) => ({
		relationId: relationPath.relationId,
		mode: relationPath.mode,
		path: createRelationPath(relationPath.sourcePlacement, relationPath.targetPlacement, relationPath.mode),
		emphasis: relationEmphasis(relationPath.mode),
		layering: relationLayering(relationPath.mode)
	}));
	const shapeFamilies = Array.from(new Set(shapes.map((shape) => shape.shapeFamily)));

	return {
		document,
		canvasSize: CANVAS_SIZE,
		center: CENTER,
		layerRadii,
		sectors: projection.sectors,
		shapes,
		relations,
		shapeFamilies,
		oppositions: OPPOSITIONS,
		orientationSummary: summarizeOrientation(document)
	};
}

export function createDefaultRunicSelection(library: ResolvedRunicLibrary): ResolvedRunicLibraryEntry | null {
	for (const group of library.groups) {
		if (group.entries.length > 0) {
			return group.entries[0];
		}
	}

	return null;
}
