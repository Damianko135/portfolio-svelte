// src/lib/types.ts
export interface Project {
	id: number;
	name: string;
	url: string;
	screenshot: string; // Required field for screenshot path
	description: string; // Description field
	technologies: Array<{ icon: string; name: string }>; // Array of technologies (icon and name)
}

export interface AboutItem {
	icon: string;
	text: string;
	subText?: string;
	color?: string;
}

export interface Interest {
	icon: string;
	text: string;
	color?: string;
}

export interface project {
	name: string;
	url: string;
	screenshot?: string;
	description: string;
	technologies?: Array<{ icon: string; name: string }>;
	icon: string;
}
