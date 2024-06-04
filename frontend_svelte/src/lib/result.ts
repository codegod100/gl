
export class Result<T> {
    constructor(a: T, e: Error) {
        this.a = a
        this.e = e
    }
    a: T
    e: Error

    match(): T | Error {
        if (this.a != null) {
            return this.a
        }
        return this.e
    }
}