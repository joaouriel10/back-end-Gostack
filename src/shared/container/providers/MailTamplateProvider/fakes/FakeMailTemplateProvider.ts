import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse(): Promise<String> {
        return 'Mail content';
    }
}

export default FakeMailTemplateProvider;