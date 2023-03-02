# Widget.js - A simple framework to create Web UI/UX.

## Install
```
$ npm i widget.js
```

## Usage
```js
import { App, ContaienrWidget, ImageWidget } from 'widget.js';

const app = new App();
document.body.append(app.node); // Append app element to document body

const container = new ContainerWidget({
    children: [
        new ImageWidget({
            src: 'https://defaultkavy.com/assets/images/A_man_dancing.gif',
            autoload: true
        })
    ]
});

app.append(container); // Append container object to app

```

## Features
- Everything is Widget.
- Easy to build the page base on code.
- Create no limit of Layout level.
- Convenient switch page using Layout Manager Widget and Route.
- Update text content with custom function.

## Questions

### **How to update the content of Text Widget when content is Function?**
Text Widget content allow string and function of return string. The content function will be run when TextWidget.update() is called.

Basic usage example:
```ts
import { TextWidget } from 'widget.js';

let title = 'This is title!';
const needUpdateList = [];

// create a function that return a variable string
function getTitle(widget: TextWidget) {
    needUpdateList.push(widget); // push the target widget to list!
    return title;
}

const text = new TextWidget({
    content: widget => getTitle(widget), // the parameter widget is this TextWidget
    styles: 'h1'
})

document.body.append(text.node); // append text widget to document

// Now, change the title!
title = 'This is NEW Title!';

// all text widget in list will be updated!
needUpdateList.forEach(widget => widget.update()); 
```

Advance usage example:
```ts
import { TextWidget, ContainerWidget } from 'widget.js';

class User {
    constructor(data) {
        this.name = data.name;
        this.bio = data.bio;
        this.followers = data.followers;
        // create a widget list that waiting for update
        this.updateWidgetList = [];
    }

    addFollower() {
        this.followers += 1;
        this.updateWidgetList.forEach(widget => widget.update());
    }

    registerWidget(widget) {
        this.updateWidgetList.push(widget);
        return this; // return User object
    }
}

const user = new User({
    name: 'Kavy',
    bio: 'An artist love to coding.',
    followers: 99
})

// create a container to display user infomation
const info_container = new ContainerWidget({
    children: [
        new TextWidget({
            content: w => user.registerWidget(w).name,
            styles: 'h1'
        }),
        new TextWidget({
            content: w => user.registerWidget(w).follower,
            styles: 'h1'
        })
    ]
})

document.body.append(info_container.node); // append container widget to document

// let's increase follower for Kavy!
user.addFollower();
```

## Author
[Website](https://defaultkavy.com) /
[Twitter](https://twitter.com/defaultkavy)