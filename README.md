# Browser File Storage
Abstracts the complexity of the IndexedDB Api so that a user can easily save files on the browser.

While there are some local database like libraries to store json objects, advanced queries, replication, etc, this is very focused on a single use case: saving and loading files locally.

# Important
- Browser must support the IndexedDB API as it cannot be polyfilled: https://caniuse.com/#feat=indexeddb
- Browser must support promises or include a Promise polyfill: https://www.npmjs.com/package/promise-polyfill
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

Save takes two mandatory parameters: *filename and contents*
Save also takes an optional third parameter: *mimetype*

*filename* is a string and will be used as identifier to save and load the file from the inner database. the extension in the filename will also be used if possible to auto-detect the mimetype of the file, unless the content we are storing is a blob with an already existing mimetype, or if the third optional parameter *mimetype* is set (In which case mimetype will be forced to whatever was specified on that third parameter)

*contents* can be a raw string, a blob, a BrowserFile (Type used internally to unify what we save and load from browserFileStorage)

### Simple Examples

```javascript
browserFileStorage.save('settings.txt', 'This is the settings file!').then(((file) => {
    console.log('Saved file successfully!', file)
}).catch((error) => {
    console.log('Could not save the file!', file)
})
```

```javascript
// .. use fetch, axios, $.ajax, xhr request, etc to fetch an image blob accordingly...
browserFileStorage.save('background.png', myImage).then(((file) => {
    console.log('Saved image successfully!', file)
}).catch((error) => {
    console.log('Could not save the image!', file)
})
```

### In Depth Example and Error Handling

```javascript
// Some settings JS object.
const data = { preferences: { notifications: "off" } }
const json = JSON.stringify(data)

browserFileStorage.save('settings.json', json ).then((file) => {
    // ... File saved successfully. 
    console.log('File Saved successfully!', file)
}).catch((error) => {
    if(!error.init) {
        // ... browserFileStorage was not initialized yet.
    }

    if(error.invalidFilename) {
        // ... Error with filename... It is either empty, null, or not a string.
    }

    if(error.invalidContents) {
        // ... Error with contents... They are empty, or not what expected... Blob, String, BrowserFile, etc.
    }

    if(error.dbError) {
        // ... Internal IndexedDB error! Oh no! Failed to save.

        // ... What was the problem exactly?
        console.error(error.errorText)
    }

})
```

### More Specific Examples

[Some specific save examples of different scenarios](#specific-save)

## Browser File methods and properties

When saving or loading a file, it is stored in a *BrowserFile* Object.

```javascript
let file = // ... Browser File returned from a load or save's resolved promise.

console.log(file.extension) // extension of file.
console.log(file.filename) // Same as the filename used to load file
console.log(file.lastModified) // JS timestamp when it was last saved/overwritten
console.log(file.size) // Size recorded when last stored.
console.log(file.blob) // Blob Object, this can be turned into a local URL, sent via xhr, etc. This is the actual `file`
console.log(file.type) // Mimetype

// Create a local URL for the resource. It will return the same url no matter how many times you called unless destroyed.
let url = file.createURL()
// Use `url` like you would a regular url within your page.. Ex: change an image tag's src to url, open the url on a new tab, etc

// Delete the created URL, url will no longer work.
// It will also make createURL() return a new URL
file.destroyURL()

// Read as Raw String
file.toString().then((string) => {
    // .. String contains raw text.
    console.log(string)
}).catch((error) => {
    if(!error.supported) {
        // ... FileReader Api is not available on this browser!
    }

    if(error.fileError) {
        // ... There was an error finding a blob to read internally.
    }

    if(error.readError) {
        // ... There was an error reading the file as specified.
        console.error(error.e) // more details...
    }
})

// Read as Binary String, Data URL, Array Buffer...
// Works the same as 'toString' including all the properties on the error object.
file.toBinaryString().then((binaryString) => { /* ... */ })
file.toDataURL().then((dataURL) => { /* ... */ })
file.toArrayBuffer().then((arrayBuffer) => { /* ... */ })
```

## Loading a file

Loading simply takes a filename as an argument and returns a promise that when resolved, contains the BrowserFile object.

### Basic Examples
```javascript
browserFileStorage.load('settings.json').then((file) => {
    file.toString().then((stringContents) => {
        // .. parse to JSON and begin using ...
        let object = {}
        try {
            object = JSON.parse(stringContents)
        } catch (e) {
            // Error Parsing.
        }
        
        console.log(object)
    })
}).catch((error) => {
    console.error(error)
})
```

```javascript
browserFileStorage.load('background.png').then((file) => {
    // Assign image source
    let image = document.getElementById('someImage')
    let url = file.createURL()
    image.src = url
}).catch((error) => {
    console.error(error)
})
```


### In Depth Example and Error Handling

```javascript
browserFileStorage.load('example.ico').then((file) => {
    // ... File loaded successfully.
    console.log('File Loaded Successfully!', file)
}).catch((error) => {
    if(!error.init) {
        // ... browserFileStorage was not initialized yet.
    }

    if(error.invalidFilename) {
        // ... Error with filename... It is either empty, null, or not a string.
    }

    if(error.notFound) {
        // ... File was not found in inner local database. Filename might be incorrect, or file might no longer exist.
    }

    if(error.dbError) {
        // ... Internal IndexedDB error! Oh no! Failed to load.

        // ... What was the problem exactly?
        console.error(error.errorText)
    }
})

```






# Capacity

...

# <a name="specific-save"></a> Save specific examples.

### Specific Examples

#### Storing a file fetched using XHR

#### Storing a file from upload file input

#### Storing a file's raw content

#### Storing a file through data URL

#### Storing a file from a raw URL (local or web)