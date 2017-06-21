import { SoterawirelessUiPage } from './app.po';

describe('soterawireless-ui App', () => {
  let page: SoterawirelessUiPage;

  beforeEach(() => {
    page = new SoterawirelessUiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
