export interface DataResource {
	fetch(path: any[]): any;
	writeback(data: any, path: any[]);
}
