# Browser File Storage
Abstracts the complexity of indexed DB so that a user can easily save files/blobs by key/filename on the browser.

# Installation
Installing Package
```javascript
npm install -D browser-file-storage
```

Importing in Webpack
```javascript
import sevenTween from 'seven-tween'
```

Importing through script tag  
*To be found in the builds folder*
```html
<script type="text/javascript" src="seven-tween.min.js"> 
```


# Usage
```javascript
import browserFileStorage from 'browser-file-storage'

browserFileStorage.init({
    namespace: 'my_amazing_app',
    onSuccess: (message, context) => {
        console.log('onSuccess - ', message, context)
    },
    onFail: (error, context) => {
        console.error('onFail - ', error, context)
    }
})
```