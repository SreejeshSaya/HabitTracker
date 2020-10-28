import { Component } from '@angular/core';

@Component({
    selector: 'app-loading',
    template: `
        <div id="loading-gif">
            <img src="../../assets/loading.gif" alt="loading" />
        </div>`,
    styles: [
        `#loading-gif { position: fixed; 
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }`
    ]
})
export class LoadingComponent {
    constructor() {}
}