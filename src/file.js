


class FileAbstraction {
    constructor(props) {
        this.filename = props.filename
        this.lastModified = props.lastModified
        this.blob = props.blob
        this.extension = props.extension
        this.size = props.size
    }

    _toIDB() {
        return {
            filename: this.filename,
            lastModified: this.lastModified,
            blob: this.blob,
            extension: this.extension,
            size: this.size,
        }
    }

    createURL() {
        if(this._createdURL) {
            return this._createdURL
        }
        this._createdURL = URL.createObjectURL(this.blob)
        return this._createdURL
    }

    destroyURL() {
        if(this._createdURL) {
            URL.revokeObjectURL(this._createdURL)
            this._createdURL = null
        }
    }
}


export default FileAbstraction