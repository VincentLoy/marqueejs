# MarqueeJS

## Status: Alpha Work In Progress

> ⚠️ This library is currently in alpha. While core features are quite stable (maybe), APIs might change before the 1.0 release.
>
> I encourage testing and feedbacks but don't recommend in production environments.

<p class="center">
    <img src="https://img.shields.io/github/package-json/version/VincentLoy/marqueejs?style=flat-square" alt="Version" />
    <img src="https://img.shields.io/github/license/VincentLoy/marqueejs?style=flat-square" alt="License" />
</p>

MarqueeJS is a modern, lightweight JavaScript library for creating scrolling text or HTML content, inspired by the old-school &lt;marquee&gt; element. It supports various directions, pause-on-hover, dynamic content updates, and more, providing an easy way to add animated scrolling content to your web applications without heavy dependencies.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Basic Usage](#basic-usage)
4. [Options](#options)
5. [Methods](#methods)
    - [pause](#pause)
    - [resume](#resume)
    - [destroy](#destroy)
    - [addContent](#addcontent)
    - [replaceContent](#replaceContent)
    - [getContentList](#getcontentlist)
    - [updateSpeed](#updatespeed)
    - [updateGap](#updategap)
    - [updateSeparator](#updateseparator)
    - [updateCloneCount](#updateclonecount)
    - [updateContainerHeight](#updatecontainerheight)
    - [updatePauseOnHover](#updatepauseonhover)
    - [recalculatePositions](#recalculatepositions)
    - [patchContent](#patchcontent)
6. [Advanced Usage](#advanced-usage)
7. [Examples](#examples)
8. [Development](#development)
9. [License](#license)

---

## Features

-   Lightweight and dependency-free
-   Configurable speed, direction, and spacing
-   Supports touch, hover, and visibility events (pauses/resumes automatically)
-   Dynamic addition and replacement of marquee content
-   Vertical and horizontal directions
-   Custom content list with HTML support
-   Safe content validation to limit dangerous tags and attributes

---

## Installation

Install using npm or Bun:

```bash
# Using npm
npm install marqueejs

# Using Bun
bun install marqueejs
```

Or just include the compiled build in your project if you prefer a script tag.

---

## Basic Usage

1. Create an element in your HTML with some text:
    ```html
    <div class="marquee-basic">Hello, MarqueeJS!</div>
    ```
2. Initialize MarqueeJS in your JavaScript:

    ```typescript
    import { marqueejs } from "marqueejs";

    marqueejs(".marquee-basic", {
        speed: 80,
        direction: "left",
    });
    ```

By default, MarqueeJS will scroll the content leftward at a speed of 80 pixels per second.

---

## Options

Below is a summary of the main configuration options:

| Option              | Type                                | Default | Description                                                                                          |
| ------------------- | ----------------------------------- | ------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| speed               | number                              | 100     | Scrolling speed in pixels per second. Must be positive.                                              |
| direction           | 'left' \| 'right' \| 'up' \| 'down' | 'left'  | The direction in which the marquee scrolls.                                                          |
| pauseOnHover        | boolean                             | false   | Whether to pause the animation on mouse hover.                                                       |
| gap                 | number                              | 20      | Gap in pixels between items or clones.                                                               |
| cloneCount          | number                              | 'auto'  | 'auto'                                                                                               | Number of times each item is cloned (for continuous flow). Maximum 15. |
| separator           | string                              | ''      | Character or string to show between items for horizontal directions. Ignored for vertical scrolling. |
| contentList         | string[]                            | []      | Array of HTML strings to be displayed by the marquee.                                                |
| keepOriginalContent | boolean                             | false   | Whether to preserve the original HTML content inside the marquee element when using contentList.     |
| containerHeight     | number                              | (auto)  | Fixed height for container (required for vertical directions to ensure a consistent layout).         |
| contentValidation   | object                              | Varies  | Additional content validation options (like forbidden tags, maxLength, etc.).                        |

---

## Methods

Once you initialize MarqueeJS, you get back an instance with the following public methods:

### pause

Pauses the scrolling in place. Calling `resume` will continue from where it left off.

```typescript
instance.pause();
```

### resume

Resumes scrolling from the current position if paused, or starts if it was never started.

```typescript
instance.resume();
```

### destroy

Removes event listeners, stops animations, and cleans up inserted DOM elements and styles. After calling `destroy`, the instance becomes unusable.

```typescript
instance.destroy();
```

### addContent

Adds new content (HTML string or array of strings) to the marquee. An optional `addToStart` parameter determines whether to add to the beginning or end of the list. An optional `callback` parameter allows executing a function after the content is added.

```typescript
instance.addContent("New item"); // added at the end
instance.addContent(["Item 1", "Item 2"], true); // added at the start
instance.addContent("New item", false, () => {
    console.log("Content added");
}); // added at the end with callback
```

### replaceContent

Replaces the entire content list at once, discarding the old list entirely.

```typescript
instance.replaceContent(['<span class="badge">FLASH NEWS</span> Completely new content', "Another new item"]);
```

### getContentList

Retrieves the current content list being used by the marquee.

```typescript
const currentItems = instance.getContentList();
console.log(currentItems);
```

### updateSpeed

Updates the scrolling speed.

```typescript
instance.updateSpeed(150);
```

### updateGap

Updates the gap between elements.

```typescript
instance.updateGap(30);
```

### updateSeparator

Updates the separator between elements.

```typescript
instance.updateSeparator(" • ");
```

### updateCloneCount

Updates the number of clones.

```typescript
instance.updateCloneCount(5);
```

### updateContainerHeight

Updates the container height.

```typescript
instance.updateContainerHeight(300);
```

### updatePauseOnHover

Updates the pause on hover option.

```typescript
instance.updatePauseOnHover(true);
```

### recalculatePositions

Recalculates the positions of the elements. Useful if you encounter any issues with element positioning.

```typescript
instance.recalculatePositions();
```

### patchContent

Modifies the content list by adding or replacing items at specified positions (start or end). This method provides flexible content management with various options for updating the marquee content.

#### Parameters

-   `content` (string | string[]): Single string or array of strings to add/replace
-   `position` ('start' | 'end'): Where to patch the content
-   `reset` (boolean, optional): If true, pauses and resets the marquee before patching (default: false)
-   `callback` (() => void, optional): Function called after patching completes

#### Behavior

-   If the current content list is empty, the new content becomes the entire list
-   If new content length ≥ current content length, replaces all existing content
-   If new content length < current content length:
    -   For 'start' position: Replaces elements at the beginning
    -   For 'end' position: Replaces elements at the end

#### Note

-   Content is automatically validated before patching
-   Invalid content triggers a warning and aborts the operation
-   When reset is false, content elements are recreated and positions recalculated
-   When reset is true, the marquee completely resets after patching
-   Callback executes on the next animation frame after patching completes

```typescript
// example
console.log(instance.getContentList());
// > output: ['a', 'b', 'c', 'd']

// Add content at the start
instance.patchContent("New content", "start");
// > result: ['New Content', 'b', 'c', 'd']

// Add content at the end
instance.patchContent(["Item 1", "Item 2"], "end");
// > result: ['a', 'b', 'Item 1', 'Item 2']

// Replace existing content at start
instance.patchContent("New content", "start", true);
// > result: ['New Content', 'b', 'c', 'd'] + reset the marquee

// Add with callback
instance.patchContent("New content", "end", false, () => {
    console.log("Content patched");
});
// > result: ['a', 'b', 'c', 'New content'] + callback called after processing new items
```

---

## Advanced Usage

MarqueeJS supports advanced configuration for complex layouts and interactions:

1. **Vertical Scroll**
   Configure `direction: 'up'` or `direction: 'down'` along with `containerHeight` to ensure the marquee has enough vertical space.

    ```typescript
    marqueejs(".vertical-marquee", {
        direction: "down",
        speed: 90,
        containerHeight: 300,
    });
    ```

2. **Dynamic Content Updates**
   Add items or replace them entirely after initialization:

    ```typescript
    const vertical = marqueejs(".vertical-marquee", {
        direction: "up",
        speed: 100,
        contentList: ["First item", "Second item"],
    });

    // Add more items after 2 seconds
    setTimeout(() => {
        vertical.addContent(["Extra content", "Another item"], true);
    }, 2000);

    // Replace the entire content list after 5 seconds
    setTimeout(() => {
        vertical.replaceContent(["Entirely new content"]);
    }, 5000);
    ```

3. **Touch and Visibility Control**
   Scrolling automatically pauses while you touch or switch to a different tab and then resumes when you release or return to the page.

4. **Content Validation**
   By default, MarqueeJS strips out or warns about potentially dangerous HTML tags or attributes. You can configure `contentValidation` in the options to adjust these rules.

---

## Content Validation

By default, MarqueeJS applies validation to protect your content from unsafe HTML tags and attributes. You can adjust these rules using the “contentValidation” field in your MarqueeOptions. This object merges your custom values with the built-in defaults, so you never lose important checks.

### How It Works

-   Default forbidden tags: script, style, iframe, object, embed, form, etc.
-   Default forbidden attributes: onclick, onmouseover, javascript, etc.
-   Default maxLength: 8500 characters per item.

Below is a complete example of customizing these validations:

```typescript
import { marqueejs } from "marqueejs";

marqueejs(".selector", {
    // ...existing MarqueeOptions...
    contentValidation: {
        // Override maxLength (defaults to 8500)
        maxLength: 2000,

        // Additional forbidden tags merged with defaults
        forbiddenTags: ["img", "video"],

        // Additional forbidden attributes merged with defaults
        forbiddenAttributes: ["style", "href"],
    },
    contentList: [
        "<div>Some item</div>", // ok element
        '<img src="..." />', // forbidden
        // ...
    ],
});
```

Any content items violating these rules are automatically detected and handled. Use caution when allowing user-submitted HTML to avoid XSS risks.

---

## Examples

Below are some basic examples to illustrate different marquee configurations.

1. **Left Scrolling**

    ```typescript
    marqueejs(".example-left", {
        speed: 80,
        direction: "left",
    });
    ```

2. **Right Scrolling with Separator**

    ```typescript
    marqueejs(".example-right-separator", {
        direction: "right",
        separator: " • ",
        gap: 50,
    });
    ```

3. **Vertical Marquee**

    ```typescript
    marqueejs(".example-vertical", {
        direction: "up",
        speed: 120,
        containerHeight: 400,
        contentList: ["Item One", "Item Two <b>bold text</b>", "Item Three with <i>italic text</i>"],
    });
    ```

4. **Fast Marquee with Pause on Hover**
    ```typescript
    marqueejs(".example-fast-pause", {
        speed: 240,
        pauseOnHover: true,
        cloneCount: 2,
    });
    ```

---

## Development

To contribute or run this project locally:

1. **Install Dependencies**

    ```bash
    bun install
    ```

2. **Start Development Server**

    ```bash
    # Using Bun
    bun run dev
    ```

    A local development server will start with hot reload.

3. **Build**

    ```bash
    # Production build
    bun run build
    ```

    This generates the optimized production builds for your distribution or documentation.

4. **Testing**
   Currently in progress. Add your tests in the `tests/` folder.

We welcome pull requests and suggestions!

---

## License

This project is available under the MIT license. Feel free to use, modify, and distribute under the terms of the license.
