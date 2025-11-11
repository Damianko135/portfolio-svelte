export interface Technology {
	name: string;
	icon: string;
}

export interface Project {
	id: number;
	name_key: string;
	url: string;
	description_key: string;
	technologies: Technology[];
}
