import {SObjectService, SObject} from '../../utils/sobject.model';
import {MailContent, TemplateMailFactory, EmailTopic, EmailTopicFactory} from './email.model';
import {Observable} from 'rxjs/Rx';
import {User} from '../user/user.model';

export class EmailService extends SObjectService{

        public getEmailTopics(): Observable<EmailTopic[]> {
            this.type = EmailTopicFactory();
            return this.where(null, 'EmailTopic');
        }

		public sendEmail(emailContentList: MailContent[]): Observable<any>{
			return this.forceService.post('/guest/sendEmail', emailContentList);
		}

		public sendEmailTemplate(templateName: string, to: User, what: SObject): Observable<any>{
			let content = TemplateMailFactory(templateName, what.Id, to.Id, [to.Email]);
			return this.forceService.post('/guest/sendEmail', [
				content
			]);
		}

		public sendEmailToAddress(templateName: string, from: User, to: string, what: SObject): Observable<any>{
			let content = TemplateMailFactory(templateName, what.Id, from.Id, [to]);
			return this.forceService.post('/guest/sendEmail', [
				content
			]);
		}
}