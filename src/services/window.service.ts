function _window(): any {
    return window;
}

export class WindowRef {
    getWindow(): any {
        return _window();
    }
}