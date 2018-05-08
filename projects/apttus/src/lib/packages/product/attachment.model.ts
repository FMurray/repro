import {SObject} from '../../utils/sobject.model';

export interface Attachment extends SObject{
	BodyLength: number;
	ContentType : string;
	Description: string;
	Name: string;
	ParentId: string;
}

export function AttachmentFactory(): Attachment{
	return {
		BodyLength : 0, 
		ContentType : null,
		Description : null,
		Name : null,
		ParentId : null
	} as Attachment
}