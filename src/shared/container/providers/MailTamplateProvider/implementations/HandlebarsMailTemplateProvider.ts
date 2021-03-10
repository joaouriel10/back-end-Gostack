import handlebars from 'handlebars';
import fs from 'fs';

import IParseMailTemplateDto from '../dtos/IParseMailTemplateDTO';
import IMailTemplateProvider from "../models/IMailTemplateProvider";

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
    public async parse({ file, variables }: IParseMailTemplateDto): Promise<String> {
        const templateFileContent = await fs.promises.readFile(file, {
            encoding: 'utf-8'
        });
        const parserTemplate = handlebars.compile(templateFileContent);
        
        return parserTemplate(variables);
    }
}

export default HandlebarsMailTemplateProvider;