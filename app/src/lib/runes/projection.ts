import type {
	ProjectionPlacement,
	ProjectionRelationPath,
	RunicDocument,
	RunicRef,
	RunicSector
} from './contracts';

const FULL_CIRCLE_DEGREES = 360;
const START_ANGLE_DEGREES = -90;

export type DerivedProjectionSector = {
	name: RunicSector;
	index: number;
	startAngle: number;
	endAngle: number;
	centerAngle: number;
	gravitativeMode: string;
	polarMode: string;
	rotativeMode: string;
};

export type DerivedProjectionPlacement = ProjectionPlacement & {
	sectorIndex: number;
	startAngle: number;
	endAngle: number;
	centerAngle: number;
	innerRadius: number;
	outerRadius: number;
};

export type DerivedProjectionRelationPath = ProjectionRelationPath & {
	sourcePlacement: DerivedProjectionPlacement;
	targetPlacement: DerivedProjectionPlacement;
};

export type DerivedRunicProjection = {
	layerCount: number;
	orientationFrame: RunicDocument['projection2d']['system']['orientationFrame'];
	sectors: DerivedProjectionSector[];
	placements: DerivedProjectionPlacement[];
	relationPaths: DerivedProjectionRelationPath[];
};

function getSectorSpanDegrees(sectorCount: number) {
	return FULL_CIRCLE_DEGREES / sectorCount;
}

function createDerivedSectors(document: RunicDocument): DerivedProjectionSector[] {
	const { sectors } = document.projection2d.system;
	const sectorSpanDegrees = getSectorSpanDegrees(sectors.length);

	return sectors.map((sector, index) => {
		const startAngle = START_ANGLE_DEGREES + index * sectorSpanDegrees;
		const endAngle = startAngle + sectorSpanDegrees;
		const centerAngle = startAngle + sectorSpanDegrees / 2;

		return {
			name: sector.name,
			index,
			startAngle,
			endAngle,
			centerAngle,
			gravitativeMode: sector.gravitativeMode,
			polarMode: sector.polarMode,
			rotativeMode: sector.rotativeMode
		};
	});
}

function derivePlacement(
	placement: ProjectionPlacement,
	sectors: DerivedProjectionSector[],
	layerCount: number
): DerivedProjectionPlacement {
	const sector = sectors.find((entry) => entry.name === placement.sector);
	if (!sector) {
		throw new Error(`Unknown projection sector ${placement.sector}`);
	}

	const sectorSpanDegrees = getSectorSpanDegrees(sectors.length);
	const layerThickness = 1 / layerCount;
	const innerRadius = placement.layer * layerThickness + (placement.layerOffset ?? 0) * layerThickness;
	const outerRadius = innerRadius + placement.radialSpan * layerThickness;
	const startAngle = sector.startAngle + (placement.sectorOffset ?? 0) * sectorSpanDegrees;
	const endAngle = startAngle + placement.sectorSpan * sectorSpanDegrees;
	const centerAngle = startAngle + (endAngle - startAngle) / 2;

	return {
		...placement,
		sectorIndex: sector.index,
		startAngle,
		endAngle,
		centerAngle,
		innerRadius,
		outerRadius
	};
}

function buildPlacementLookup(placements: DerivedProjectionPlacement[]) {
	const lookup = new Map<RunicRef, DerivedProjectionPlacement>();
	for (const placement of placements) {
		lookup.set(placement.ref, placement);
	}
	return lookup;
}

export function deriveRunicProjection(document: RunicDocument): DerivedRunicProjection {
	const sectors = createDerivedSectors(document);
	const placements = document.projection2d.placements.map((placement) =>
		derivePlacement(placement, sectors, document.projection2d.system.layerCount)
	);
	const placementLookup = buildPlacementLookup(placements);

	const relationPaths = document.projection2d.relationPaths.map((relationPath) => {
		const sourcePlacement = placementLookup.get(relationPath.source);
		const targetPlacement = placementLookup.get(relationPath.target);

		if (!sourcePlacement || !targetPlacement) {
			throw new Error(`Projection path ${relationPath.relationId} references missing placement`);
		}

		return {
			...relationPath,
			sourcePlacement,
			targetPlacement
		};
	});

	return {
		layerCount: document.projection2d.system.layerCount,
		orientationFrame: document.projection2d.system.orientationFrame,
		sectors,
		placements,
		relationPaths
	};
}
