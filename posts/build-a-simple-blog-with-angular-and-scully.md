---
title: Build a Simple Blog with Angular and Scully
description: A tutorial which will walk you through the steps to build a blog with Angular and Scully.  Step-by-step instructions and resources.  Get in here and learn!
published: true
datePublished: July 19, 2024
---

# Build a Simple Blog with Angular and Scully

July 19th, 2024

<div id="toc">
  <h2>Table of contents</h2>
</div>

## Prerequisites

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

These are all necessary to follow along with this tutorial:

- <a href="https://docs.npmjs.com/downloading-and-installing-node-js-and-npm" target="_blank">NPM</a>
- <a href="https://nodejs.org/en/download/package-manager" target="_blank">Node.js</a>
- <a href="https://angular.dev/tools/cli/setup-local" target="_blank">Angular</a>

## Angular

### New App + Boiler Plate

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

To create the boiler plate code for your app, run this Angular command in your terminal:

`ng new wt-blog --routing --style=scss`

This will create a new directory titled 'wt-blog' (you can name this whatever you want, but be sure to use your updated 'title' throughout this tutorial). All the necessary Angular code will be placed in the directory. The --routing flag tells the CLI to include routing, in the Angular app, and the --style flag sets your style sheets to use scss.

### Integrated Development Environment (IDE)

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

You can now view and interact with the newly created Angular app through your choice of IDE (I use <a href="https://code.visualstudio.com/" target="_blank">Visual Studio Code</a>). Run VS Code and open the newly created 'wt-blog' directory. Now, you can use the in-editor terminal to run commands via Terminal > New Terminal

### Bootstrap

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

From the new terminal (if running Windows, use PowerShell for your terminal) run this command:

`npm i bootstrap`

This will download and install the bootstrap packages. More info here: <a href="https://getbootstrap.com/docs/5.0/getting-started/download/" target="_blank">https://getbootstrap.com/</a>

To add bootstrap to your project open the src/styles.scss file and add this line:

`@import 'bootstrap/scss/bootstrap';`

### Core Module

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Return to your terminal and run this command:

`ng g module core`

This will generate the module 'core' and place it here: src/app/core.module.ts

### Header Component

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

From the terminal run this command:

`ng g component header --path=src/app/core --module=core --export`

This will generate the component 'header' and place it in the src/app/core/header folder. This includes the header component html file, spec (testing) file, the typescript file, and it's own style sheet (scss).

It will also update the core.module.ts file with an import statement to include the HeaderComponent.

Open and update the newly created header.component.html file to look like this:

```html
<nav class="navbar navbar-expand navbar-light bg-light">
  <div class="container-fluid">
    <a href="#">Angular Project</a>
    <ul class="navbar-nav me-auto">
      <li calss="nav-item">
        <a href="#" class="nav-link">Articles</a>
      </li>
      <li calss="nav-item">
        <a href="#" class="nav-link">Contact</a>
      </li>
    </ul>
  </div>
</nav>
```

This will be your applications "header" navigation bar. The class items use bootstrap for styling.

### Shared Module

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Back to the terminal:

`ng g module shared`

This creates the shared module and places it in the src/app/shared directory.

### Footer

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Next run the command:

`ng g component footer --path=src/app/shared --module=shared --export`

This creates the footer component (all html, ts, and scss files) and places it in the shared directory. It also updates the shared module to include the FooterComponent.

Open the footer.component.html file and replace the contents with this:

```html
<nav class="navbar fixed-bottom navbar-light bg-light">
  <div class="container-fluid">
    <p>Copyright @{{ currentDate | date : "y" }}. All Rights Reserved.</p>
  </div>
</nav>
```

VSCode should give you an error message notifying you that the currentDate does not exist in the FooterComponent. Let's fix that.
Open the footer.component.ts file and add: "currentDate = new Date();" to the FooterComponent class.

### Hook Up the Core + Shared Modules

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Now we need to let Angular "know" about the Core and Shared Modules so open the src/app/app.module.ts file and in the "imports" array add "CoreModule" and "SharedModule".

To do this you can type in "CoreModule" and select the import helper from VSCode and it will add the import statement to the top the the ts file. Do the same with SharedModule.

The file contents should look like this when complete:

```typescript
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, CoreModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

### The App Component

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Now let's put these together in the app.component.html file.

Open src/app/app.component.html file and delete all the boiler plate code and replace it with this:

```html
<app-header></app-header><app-footer></app-footer>
```

This works because we have connected the CoreModule and SharedModule, which hold the header and footer code, to the "overall" application.

### Serve It Up

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

We can now view all our hard work by returning to the terminal and running the "ng serve" command. This creates a local Angular Live Development Server and will "serve" it to `http://localhost:4200` by default.

Once the build is successful you should see a "Compiled successfully" message and now you can open a browser and navigate to the `http://localhost:4200` url.

> Quick tip: you can ctrl+click the link in the terminal to open it in your default browser.

You should now be able to see the "header" across the top of the window and the "footer" and the bottom. Congrats!

Once you have the Angular Live Development Server running, any code you change (once saved), will automatically recompile and will update the webpage in your browser.

For example, open the header.component.html file and add this class to the Angular Project a element: class="navbar-brand". Once you save it, it should refresh your browser with the changes.

### Contact Module

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Let's open a new terminal by selecting the "+" sign in the terminal menu. This keeps the original terminal (with the server running) alive and gives us a new terminal to run commands from.

With the new command line open, run this command:

`ng g module contact`

This will create for us the boiler plate code for the contact module and place it in the 'contact' directory.

Back to the terminal to run:

`ng g component contact --path=src/app/contact --module=contact --flat`

Once again, this command will generate the contact component and pair it with the contact module.

Open the contact.component.html file and replace the contents with this:

```html
<div class="card mx-auto text-center border-light" style="width: 18rem">
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Angular_full_color_logo.svg/1200px-Angular_full_color_logo.svg.png" alt="Angular Logo" class="card-img-top" />
  <div class="card-body">
    <h5 class="card-title">Angular Project</h5>
    <p class="card-text">A personal blog created with the Angular Framework.</p>
    <a href="https://angular.io/" target="_blank">Angular Official Website</a>
  </div>
</div>
```

This is our "Contact" page info. I simply included some info and links to Angular's official website. Next we need to let Angular know about it and add the code to the Routing module.

### Routing!

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Open the src/app/app-routing.module.ts file and change the const routes to look like this:

```typescript
const routes: Routes = [{ path: "contact", component: ContactComponent }];
```

Note: you will need to import the ContactComponent so add this line to the bottom of the import statements:

```typescript
import { ContactComponent } from "./contact/contact.component";
```

Next, open the app.module.ts file and include the "ContactModule" in the imports array like we did with the Core and Shared modules.

Open the app.component.html file and change it to look like this:

```html
<app-header></app-header>

<div class="container">
  <router-outlet></router-outlet>
</div>
<app-footer></app-footer>
```

We are almost ready to view it. Next we need to update the header navigation to show the contact code.

### Activate the Routes

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Go back to the header.component.html file and change remove the 'href' property from the anchor element (a) for the Contact div and change it to:

`routerLink="/contact" routerLinkActive="active"`

It should look like this:

```html
<li calss="nav-item">
  <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
</li>
```

Finally open the src/app/core/core.module.ts and include the "RouterModule" in the imports array. You will also need to import the RouterModule by adding this line to the bottom of the imports statements:

```typescript
import { RouterModule } from "@angular/router";
```

After everything is saved, you can now view your changes by clicking the "Contact" link in the navbar of your active browser. Yeah!

Now to get the Articles link working!

### Articles Module

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Return to the terminal and run:

`ng g module articles --route=articles --module=app-routing`

This creates the boiler plate code for articles and also creates it's own articles-routing module. You should also notice the updated app-routing.module.ts file which now includes a path to articles and a 'loadChildren' method.

We need to head over to the header.component.html and update the Articles link to include the 'routerLink="/articles" routerLinkActive="active"' code like we did with the Contacts link. Once you save everything, you should be able to see your changes in the browser. Click the Articles link to make sure it is working. You should see the boiler plate code.

Next we need to open the app-routing.module.ts file and add a couple more paths to it. Add these two JSON objects to the Routes array:

```typescript
{
  path: '',
  pathMatch: 'full',
  redirectTo: 'articles',
},
{
  path: '**',
  redirectTo: 'articles',
},
```

This does a couple things. First, the "blank" path (/) will now always redirect to the 'articles' url. Second, the '\*\*' path is a sort of catch-all for any other url after the /. For instance, if you type in `http://localhost:4200/test`, it will redirect to `http://localhost:4200/articles`.

## Scully

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Now that we have the ground work for our Angular app, it is time to bring in Scully (<a href="https://scully.io/" target="_blank">https://scully.io/</a>).

### Install Scully

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Run this command at your terminal (before running this, I hit ctrl+C in the Angular Live server terminal to stop it):

`npm i @scullyio/init @scullyio/ng-lib @scullyio/scully @scullyio/scully-plugin-puppeteer --force`

Once that is finished installing, open the src/app/app.module.ts file and include the "ScullyLibModule" in the imports section. Be sure to add this import as well:

```typescript
import { ScullyLibModule } from "@scullyio/ng-lib";
```

### Scully Config

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Let's create our Scully config file. Run this command in your PowerShell terminal (replace the "wt-blog" with whatever you initialized your app's title as):

`new-item scully.wt-blog.config.ts`

This command creates your Scully config file and places it at the root of your project.

Add this code for the config file:

```typescript
import { ScullyConfig } from "@scullyio/scully";

export const config: ScullyConfig = {
  projectRoot: "./src",
  projectName: "wt-blog", // <---- change this to whatever the title of your application is
  outDir: "./dist/static",
  routes: {},
};
```

### Scully Module

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Next, we need to create the Scully module for our posts. Back in PowerShell, run this:

`ng generate @scullyio/init:markdown --project wt-blog`

It will give you a couple prompts:

For the name of the module input "posts"

For the slug input "id"

Hit Enter for where you want them stored and under which routes for your requests.

This command generates all the needed module components for your posts and will update the Scully config file we just created with the correct routes.

Now let's implement the posts.

### Post Implementation

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Open src/app/articles/articles.component.ts file and have it look like this:

```typescript
import { Component, OnInit } from "@angular/core";
import { ScullyRoute, ScullyRoutesService } from "@scullyio/ng-lib";
import { Observable, map } from "rxjs";

@Component({
  selector: "app-articles",
  templateUrl: "./articles.component.html",
  styleUrls: ["./articles.component.scss"],
})
export class ArticlesComponent implements OnInit {
  posts$: Observable<ScullyRoute[]> | undefined;
  constructor(private scullyService: ScullyRoutesService) {}
  ngOnInit(): void {
    this.posts$ = this.scullyService.available$.pipe(map((posts) => posts.filter((post) => post.title)));
  }
}
```

This will grab any available "posts" from the Scully service and map them to posts$ to be used in our application.

Let's head over to the src/app/articles/articles.component.html file to use the posts.

Add this code to that file:

```html
<div class="list-group mt-3">
  <a *ngFor="let item of posts$ | async" [routerLink]="item.route" class="list-group-item list-group-item-action">
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1">{{ item.title }}</h5>
    </div>
    <p class="mb-1">{{ item["description"] }}</p>
  </a>
</div>
```

Now, each time we view the articles route, we will see each post's title and description.

### Angular Build and Scully Serve

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

In the terminal, run:

`ng build`

This rebuilds the Angular part of your application. Once it is finished building (may take a minute), run (again, change 'wt-blog' to whatever you named your app):

`npx scully --project wt-blog`

Enter y, n or hit enter for the anonymouse errors prompt.
The 'npx scully' command, from above builds your application to use the routes for the articles we just implemented.

We can now serve the application using this command:

`npx scully serve --project wt-blog`

Ctrl+click the static server url to open your application in a browser. Click around to make sure it is working.  
Note: we won't see any articles because we haven't created them yet! Let's do that next!

### Markdown

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Navigate to the posts directory for your application in your IDE. You should see a default Markdown file (.md) there. Change that file by deleting the slugs entry and changing the published property to true.

After saving those changes, we need to restart the Scully server. Ctrl+C out of the running terminal and rerun the 'npx scully --project wt-blog' command (click the up arrow to get your command history for faster development!)

This will incorporate your new changes and rebuild the application.

Next, rerun the 'npx scully serve --project wt-blog' to restart the scully server and ctrl+click on the static server url to open it. (You can also just refresh your browser window, if you left that open)

Once you click the Articles link in your app, you should now see a list of the "posts" we have created. You can see the title and the description. Click on it to view the whole post.

Congratulations on creating and viewing your first post!

Next, we will create a new post with a title passed in as an argument to Scully.

### Create Post with Title

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Quit (Ctrl+c) your running terminal and run this command:

`ng g @scullyio/init:post --name="Angular and Scully"`

When it asks for the target folder, type 'posts' (without the quotes).

Now you should see a brand new markdown file created in your 'posts' directory with the title "Angular and Scully". Notice the description has been defaulted in as well as the default published status of 'false'.

At this point we can play around with creating fake content to "fill in" the post. I like to use the lorem ipsum generater for these types of tasks (<a href="https://loremipsum.io/" target="_blank">https://loremipsum.io/</a>).

Generate your new fake content using the generater and copy-paste it to the "content" section of your posts. This is everything under the '---' in the markdown file.

Remember to change 'published' to true and remove the default generated slug.

Feel free to give it a fake description and let's build it.

### Scully-only Build and Serve

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Note: We only added Scully-related content, so we don't need to 'ng build' before this.

Back in the PowerShell terminal rerun your scully build command:

`npx scully --project wt-blog`

Then run the command to start the scully server:

`npx scully serve --project wt-blog`

Yeah! We have created our own article with the title "Angular and Scully"!

Wait, what about that "ScullyIo content" header and "End of Content" footer on each article? Well, I'm glad you asked. :-)

### Update Scully Template

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

We can change that by opening this file 'src/app/posts/posts.component.html'.

I simply deleted the header and footer content but be sure to leave this element:

```html
<scully-content></scully-content>
```

That is where your content will be served. Once you make a change to the component, you will need to rebuild using the Angular command:

`ng build`

### NOTES

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

To view the markdown files as posts, you will need to run the npx scully command to build it, then run the scully server to view it.

If you make a change to the Angular app, you will need to rebuild that via "ng build".

If you want to see Angular-only changes, you can run "ng serve" to view that code.

However, I like to see the whole application running, so I build the Angular app and then run the Scully build and server commands to see the whole application together.

## Congrats

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

Congratulations on creating your simple blog using Angular and Scully! Now get out there, play around with it, and build something!

Cheers!
<br><br>

## Resources

[Top](posts/build-a-simple-blog-with-angular-and-scully#build-a-simple-blog-with-angular-and-scully)

- Angular: <a href="https://angular.dev/" target="_blank">https://angular.dev/</a>
- Scully: <a href="https://scully.io/" target="_blank">https://scully.io/</a>
- Bootstrap: <a href="https://getbootstrap.com/" target="_blank">https://getbootstrap.com/</a>
- Markdown: <a href="https://www.markdownguide.org/getting-started/" target="_blank">https://www.markdownguide.org/getting-started/</a>
- Visual Studio Code: <a href="https://code.visualstudio.com/" target="_blank">https://code.visualstudio.com/</a>

- Huge shout-out to this YouTube video: <a href="https://www.youtube.com/watch?v=bVHQC37lsm4" target="_blank">https://www.youtube.com/watch?v=bVHQC37lsm4</a>
  This blog article is essentially a post describing everything this YouTube content creater (Pig Learning) has shown in the video.  
  All credit to that content creator. Please visit their channel and subscribe here: <a href="https://www.youtube.com/@piglearning" target="_blank">https://www.youtube.com/@piglearning</a>
