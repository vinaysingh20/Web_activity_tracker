'use strict';

class Tab{
    constructor(domain,favicon,counter){
        this.domain = domain;
        this.favicon = favicon;
        if(counter !== undefined){
            this.counter = counter;
        } else{
            this.counter = 0;
        }
        this.blacklist = false;
        this.limit = -1;
    }
}