import { Subject } from 'rxjs';

const subject = new Subject()

const EmitInterface = {
    sendMessage: (eventId, options) => subject.next({id : eventId, options: options}),
    getMessage: () => subject.asObservable()
};

export default EmitInterface
