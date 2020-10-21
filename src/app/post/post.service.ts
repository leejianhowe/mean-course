import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
/**rxjs is all about observables
 * objectsd that help pass data around
 */
import { HttpClient } from '@angular/common/http';

/**add JS object in the arguement @injectable*/
/**angular will find it at the root level and
 * create only one instance of the service  */
@Injectable({ providedIn: 'root' })
export class PostsService {
  /**private property
   * cannot be edited from outside or other post
   */
  /**arrays are reference types
   * reference type is a type that when you copy the object
   * the address of the object or pointer will be copied
   */
  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}
  /**retrieve posts from storage
   * copies array to prevent editing original
   * immutable array
   */
  getPosts() {
    // client side only
    /**spread feature */
    /**[array] to create new array
     * ... to copy the elements of the pointed array
     * to new array
     * arrays become immutable
     */
    // return [...this.posts];

    this.http
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      //add in pipe operator
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              date: post.date,
            };
          });
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdatedListner() {
    return this.postUpdated.asObservable();
  }

  /**add post to storage in posts array */
  addPosts(title: string, content: string) {
    let date = new Date();
    const post: Post = { id: null, title: title, content: content, date: date };
    this.http
      .post<{ message: string; postId: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        const id = responseData.postId;
        post.id = id;
        console.log(responseData.message);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }
  deletePost(postId: string) {
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        /**own testing purpose */
        // let test = this.posts;

        // for (let index = 0; index < test.length; index++) {
        //   const element = test[index];
        //   console.log(element.id);
        // }
        /**.filter() returns a elements that matches the condition */
        const updatedPosts = this.posts.filter(function returnArray(post) {
          return post.id !== postId;
        });
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }
}
