


class SavedFile {
    constructor(props) {
        this.filename = props.filename
        this.lastModified = props.lastModified
        this.blob = props.blob
        this.extension = props.extension
        this.size = props.size
    }

    _toIDB () {
        return {
            filename: this.filename,
            lastModified: this.lastModified,
            blob: this.blob,
            extension: this.extension,
            size: this.size,
        }
    }

    createURL () {
        if(this._createdURL) {
            return this._createdURL
        }
        this._createdURL = URL.createObjectURL(this.blob)
        return this._createdURL
    }

    destroyURL () {
        if(this._createdURL) {
            URL.revokeObjectURL(this._createdURL)
            this._createdURL = null
        }
    }

    _toSomething (mode) {
        return new Promise((resolve, reject) => { 
            if (FileReader) {
                const reader = new FileReader();

                if(!this.blob) {
                    return reject({ supported: true, fileError: true })
                }

                reader.addEventListener('loadend', (e) => {
                    return resolve(e.srcElement.result)
                });

                reader.addEventListener('error', (e) => {
                    return reject({ supported: true, readError: true, e: e })
                });

                reader[mode](this.blob);
            } else {
                return reject({ supported: false })
            }
        })
    }

    toString () {
        return this._toSomething('readAsText')
    }

    toBinaryString () {
        return this._toSomething('readAsBinaryString')
    }

    toArrayBuffer () {
        return this._toSomething('readAsArrayBuffer')
    }

    toDataURL () {
        return this._toSomething('readAsDataURL')
    }
}


export default SavedFile