export type TimelineCategory = {
	name: string;
	color: string;
	progress_color: string;
	done_color: string;
	font_color: string;
	parent?: string;
};

const PROGRESS_DONE_COLOR = 'rgb(255,153,153)';

export const TIMELINE_CATEGORIES: TimelineCategory[] = [
	{
		name: 'Planetar',
		color: 'rgb(27,27,27)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(255,255,255)'
	},
	{
		name: 'Agranum',
		color: 'rgb(202,132,2)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Aridess',
		color: 'rgb(255,241,185)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Collot & Linunar',
		color: 'rgb(104,117,151)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Luqua',
		color: 'rgb(0,128,192)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Mognar',
		color: 'rgb(128,0,0)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(255,255,255)',
		parent: 'Planetar'
	},
	{
		name: 'Navura',
		color: 'rgb(73,128,0)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Venoxi',
		color: 'rgb(128,255,0)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Ikus',
		color: 'rgb(206,183,255)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Planetar'
	},
	{
		name: 'Mavorak',
		color: 'rgb(0,10,40)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(255,255,255)',
		parent: 'Planetar'
	},
	{
		name: 'Universal',
		color: 'rgb(136,136,136)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)'
	},
	{
		name: 'Interplanetar',
		color: 'rgb(63,63,63)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(255,255,255)'
	},
	{
		name: 'Ikusation',
		color: 'rgb(255,128,0)',
		progress_color: PROGRESS_DONE_COLOR,
		done_color: PROGRESS_DONE_COLOR,
		font_color: 'rgb(0,0,0)',
		parent: 'Interplanetar'
	}
];
