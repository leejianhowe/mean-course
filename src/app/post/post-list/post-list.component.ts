import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {
  //     title: 'first posts',
  //     content: 'this is 1st post content',
  //   },
  //   {
  //     title: 'second posts',
  //     content: 'this is 2nd post content',
  //   },
  //   {
  //     title: 'first posts',
  //     content: 'this is 3rd post content',
  //   },
  // ];

  /**use decorator @Input to bind the posts to outside */
  posts: Post[] = [];
  private postsSub: Subscription;

  /**create a service and add them to the components
   * eg post-create and post-list  */
  /**this feature is called dependency injection
   * add a constructor to the component
   * a constructor is a function which is
   * called whenver angular creates a new instance is created*/
  /**define the service as arguement in constructor
   * name: postService
   * type: PostService
   * public keyword automatically create new property
   * and store the value in the propoerty*/
  constructor(public postsService: PostsService) {}

  ngOnInit() {
    this.postsService.getPosts();
    this.postsSub = this.postsService
      .getPostUpdatedListner()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
      });
  }
  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }
}
