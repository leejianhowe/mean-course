import { variable } from '@angular/compiler/src/output/output_ast';
// @angular/core package
// consist of Component decorator that attaches to a Class
// this marks the class as a component which Anuglar scans and uses
/* to use eventemitter to emit event*/
import { Component, OnInit } from '@angular/core';
/** imports NgForms module */
import { NgForm } from '@angular/forms';

import { Post } from '../post.model';
import { PostsService } from '../post.service';

// add a Component decorator to turn it to
// that typescript understands
@Component({
  // selector allows us to use the component in our own html tag
  selector: 'app-post-create',
  // can directly type the template in
  // template:"<p>post-create works!</p><p>yippes</p>",
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css'],
})

// a Class is a new type script feacture
// also avaliable in new JS version
/**this is to create a new object in Typescript
 * and pass it to angualr
 * define how the object looks lile
 */

// create new component class
// export class NameOfComponent in Typescript
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  today = new Date();
  /**1. Add @Output decorator to emit the event to
   *    enable outside components to listen
   * 2. EventEmitter is generic type
   *    add <type of data> to be clear what data is emitted*/

  constructor(public postsService: PostsService) {}

  onAddPost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // const post: Post = {
    //   id: 1,
    //   title: form.value.title,
    //   content: form.value.content,
    //   date: this.today,
    // };

    this.postsService.addPosts(form.value.title, form.value.content);
    form.resetForm();
  }

  ngOnInit(): void {}
}
