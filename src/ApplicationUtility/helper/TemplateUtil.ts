import * as handlebars from 'handlebars';

export class TemplateUtil {
    private fs = require('fs');
    private template: string;
    constructor(template: string) {
        this.template = template
    }
    compileFile(complieData: Object) {
        return new Promise((resolve, reject) => {
            this.fs.readFile(this.template, 'utf8', (err: any, content: any) => {
                if (err)
                    reject(err);
                try {
                    const template = handlebars.compile(content, {noEscape: true});
                    let html = template(complieData)
                    resolve(html)
                } catch (err) {
                    reject(err)
                }
            })
        });
    }
}