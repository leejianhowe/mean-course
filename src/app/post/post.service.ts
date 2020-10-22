import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
/**rxjs is all about observables
 * objectsd that help pass data around
 */
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) {}

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
  getPost(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      date: Date;
    }>(`http://localhost:3000/api/posts/${id}`);
  }

  /**add post to storage in posts array */
  addPosts(title: string, content: string) {
    // let date = new Date();
    const post: Post = { id: null, title: title, content: content, date: null };
    this.http
      .post<{ message: string; postId: string; date: Date }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((responseData) => {
        //Objects are reference types, overwriting one of the property
        const id = responseData.postId;
        const date = responseData.date;
        post.id = id;
        post.date = date;
        console.log(responseData.message);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
  deletePost(postId: string) {
    this.http
      .delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe(() => {
        /**.filter() returns a elements that matches the condition */
        const updatedPosts = this.posts.filter(function returnArray(post) {
          return post.id !== postId;
        });
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
      });
  }
  // title: string, content: string, date: Date
  updatePost(id: string, title: string, content: string, date: Date) {
    const post: Post = {
      id: id,
      title: title,
      content: content,
      date: date,
    };

    this.http
      .put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe((response) => {
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(
          (element) => post.id === element.id
        );
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }
}
