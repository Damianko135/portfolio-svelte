export interface Project {
	id: number;
	uuid: string;
	name: string;
	url: string;
	screenshot?: string; // Optional screenshot path
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
