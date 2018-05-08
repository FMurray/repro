import { SObject } from "../../utils/sobject.model";

export interface MailContent{
	toAddresses: string[];
	ccAddresses?: string[];
	replyTo?: string;
	displayName?: string;
	subject: string;
	bccSender?: boolean;
	useSignature?: boolean;
	plainBody?: string;
	htmlBody?: string;
	templateName?: string;
	contactId?: string;
	whatId?: string;
}

export interface EmailTopic extends SObject {
    Target_Email__c?: string;
    Topic__c?: string;
}

export function EmailTopicFactory(): EmailTopic{
    return {
      _type : 'Email_Topic__c',
      Target_Email__c: null,
      Topic__c: null
    } as EmailTopic;
  }
  

export function MailFactory(toAddresses: string[], subject: string, plainBody: string): MailContent{
	return {
		toAddresses : toAddresses,
		ccAddresses : null,
		replyTo : null,
		displayName : null,
		subject : subject,
		bccSender : false,
		useSignature : false,
		plainBody : plainBody,
		htmlBody : null,
		templateName : null,
		contactId : null,
		whatId : null
	} as MailContent;
}

export function TemplateMailFactory(templateName: string, whatId: string, contactId: string, toAddresses: string[]){
	return {
		toAddresses : toAddresses,
		ccAddresses : null,
		replyTo : null,
		displayName : null,
		subject : null,
		bccSender : false,
		useSignature : false,
		plainBody : null,
		htmlBody : null,
		templateName : templateName,
		contactId : contactId,
		whatId : whatId
	} as MailContent;
}