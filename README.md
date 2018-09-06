# Browser File Storage
Abstracts the complexity of the IndexedDB Api so that a user can easily save files on the browser.

# Important
- Browser must support the IndexedDB API as it cannot be polyfilled: https://caniuse.com/#feat=indexeddb
- Browser must support promises or a Promise polyfill: https://www.npmjs.com/package/promise-polyfill
- Files saved locally, just like IndexedDB entries, are namespaced by domain by default, don't expect to save a file on one domain and be able to access it from another just because it is the same user's computer accessing your websites.

# Installation
Installing Package
```javascript
npm install -D browser-file-storage
```

Importing in Webpack
```javascript
import browserFileStorage from 'browser-file-storage'
```

Importing through script tag  
*To be found in the builds folder*
```html
<script type="text/javascript" src="browser-file-storage.min.js"> 
```

# Usage

## Initialization

Before using browserFileStorage, it is important to initialize the instance.
Although a namespace parameter is not needed, it is safer to namespace the instance with the name of your app.
The app name will be appended to the inner database name and create a unique identifier in case another library within the same domain, also uses this same library.

The same namespace will have to be used always when running *init* as it will re open the same inner database. 

```javascript

browserFileStorage.init('MY_AMAZING_APP').then((status) => {
    // status contains one property to know if we created or opened inner database `initial`
    if(status.initial) {
        // ... The inner database was newly created. It did not exist previously or was deleted by browser/user.
    }

    // ... Here you can begin asking for persistency, load files, save files, etc.
}).catch((error) => {
    if(!error.supported) {
        // ... IndexedDB is not supported internally! This environment or browser is not compatible with browserFileStorage :(
    }

    if(error.alreadyInit) {
        // ... You tried to run `init` but the browserFileStorage was already initialized.
    }

    if(error.dbError) {
        // ... Internal IndexedDB error! Oh no! Failed to initialize.

        // ... What was the problem exactly?
        console.error(error.errorText)
    }
})
```

## Asking for persistency

Since browser-file-storage uses indexed DB to store files internally, we can ask for user/browser permission for the data to stay on the computer permanently or until the user manually deletes it (through browser or filesystem). Default persistency means the browser can technically clear the data whenever it wants to in order to fit other data.

```javascript
browserFileStorage.persist().then((status) => {
    // status contains two properties to see what happened: `persistent`, and `canPersist`
    if(status.persistent) {
        // ... User or Browser authorized persistency for the files to save
    } else {
        if(status.canPersist) {
            // ... User/Browser did not give permission for data to persist
        } else {
            // ... Data persistency is simply not supported on current browser
        }
    }
}).catch((error) => {
    // ... browserFileStorage was probably not initialized
})
```

## Saving a file

...


# Capacity

...