import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Post, FireCreateResponse } from './interfaces';
import { environment } from 'src/environments/environment';

@Injectable({providedIn: 'root'})

export class PostService {

    constructor(
        private http: HttpClient
    ) {

    }

    // create(post: Post): Observable<Post> {
    //     return this.http.post(`${environment.fireDbUrl}posts.json`, post)
    //         .pipe(
    //             map((response: FireCreateResponse) => {
    //                 return {
    //                     ...post,
    //                     id: response.name,
    //                     createdOn: new Date(post.createdOn),
    //                     updatedOn: new Date(post.updatedOn)
    //                 };
    //             })
    //         );
    // }
    getPosts(): Observable<any> {
        return this.http.get(`${environment.host}/posts`);
    }
    create(data: Post): Observable<any> {
        return this.http.post(`${environment.host}/post`, data);
    }
    getAll(): Observable<Post[]> {
        return this.http.get(`${environment.fireDbUrl}posts.json`)
            .pipe(
                map((response: {[key: string]: any}) => {
                    return Object
                        .keys(response)
                        .map(key => ({
                            ...response[key],
                            id: key,
                            createdOn: new Date(response[key].createdOn),
                            updatedOn: new Date(response[key].updatedOn)
                        }));
                })
            );
    }

    getById(id: number): Observable<any> {
        return this.http.get(`${environment.host}/post/${id}`)
    }

    // getById(id: string): Observable<Post> {
    //     return this.http.get<Post>(`${environment.fireDbUrl}posts/${id}.json`)
    //         .pipe(
    //             map((post: Post) => {
    //                 return {
    //                     ...post,
    //                     id,
    //                     createdOn: new Date(post.createdOn),
    //                     updatedOn: new Date(post.updatedOn)
    //                 };
    //             })
    //         );
    // }

    update(post: Post): Observable<Post> {
        return this.http.patch<Post>(`${environment.host}/post`, post);
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(`${environment.host}/post/${id}`);
    }

}
