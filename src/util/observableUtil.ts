import { ClientProxy } from "@nestjs/microservices";
import { Observable, map } from "rxjs";

export class ObservableUtil {
    
    observableMapper<A>(pattern: any, data: any, client: ClientProxy): Observable<A>  {
        return client.send(pattern, data).pipe(map(data));
    } 
    
    subscribeMapper<A>(pipe: Observable<A>) {
        return pipe.subscribe((data: A) => {
            return data;
        }) 
    }

    observe<A>(pattern: any, data: any, client: ClientProxy): any {
        return this.subscribeMapper<A>(
            this.observableMapper<A>(pattern, data, client)
        );
    }

}


